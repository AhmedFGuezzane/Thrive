from collections import defaultdict
from datetime import datetime, timedelta
import calendar


def compute_statistiques(seances, taches):
    now = datetime.utcnow()
    jours_actifs = set()
    total_pomodoros = 0

    # --- Tasks ---
    total_tasks = len(taches)
    completed_tasks = sum(1 for t in taches if t.get("est_terminee"))
    overdue_tasks = sum(
        1 for t in taches if not t.get("est_terminee") and t.get("date_fin") and t["date_fin"] < now.isoformat()
    )
    taux_completion = completed_tasks / total_tasks if total_tasks else 0

    if taches:
        first_task_date = min(
            datetime.fromisoformat(t["date_creation"]) for t in taches if t.get("date_creation")
        )
        days_range = max(1, (now - first_task_date).days)
        taches_par_jour = total_tasks / days_range
    else:
        taches_par_jour = 0

    # --- Task status breakdown ---
    tasks_by_status = defaultdict(int)
    for tache in taches:
        status = tache.get("statut", "Autre")
        if status:
            tasks_by_status[status.lower()] += 1
        else:
            tasks_by_status["Autre"] += 1

    # === Seances ===
    for s in seances:
        if s.get("date_debut"):
            jours_actifs.add(s["date_debut"][:10])
        total_pomodoros += s.get("nbre_pomodoro_effectues", 0)

    # --- Compute streak ---
    sorted_days = sorted(jours_actifs, reverse=True)
    streak = 1 if sorted_days else 0
    for i in range(1, len(sorted_days)):
        if (datetime.fromisoformat(sorted_days[i - 1]) - datetime.fromisoformat(sorted_days[i])).days == 1:
            streak += 1
        else:
            break

    # --- Activity per weekday ---
    weekday_counts = defaultdict(int)
    for s in seances:
        if s.get("date_debut"):
            dt = datetime.fromisoformat(s["date_debut"])
            weekday = calendar.day_name[dt.weekday()]
            weekday_counts[weekday] += 1

    activite_par_jour = {
        day: round(weekday_counts.get(day, 0) / max(1, len(jours_actifs)), 2)
        for day in calendar.day_name
    }
    meilleur_jour = max(activite_par_jour.items(), key=lambda x: x[1])[0] if activite_par_jour else None
    derniere_date = max((s["date_debut"] for s in seances if s.get("date_debut")), default=None)

    # --- Focus score logic (normalized to 0–100) ---
    if completed_tasks > 0 and total_tasks > 0:
        average_pomodoros_per_task = total_pomodoros / total_tasks
        raw_focus_score = completed_tasks * average_pomodoros_per_task

        # Define your "ideal max" raw score for normalization
        ideal_max_focus_score = 60  # Adjust this based on real app data
        normalized_focus_score = round(min(100, (raw_focus_score / ideal_max_focus_score) * 100), 2)
    else:
        normalized_focus_score = 0

    return {
        "nbre_taches_completees": completed_tasks,
        "taux_completion_taches": round(taux_completion, 2),
        "nbre_taches_par_jour": round(taches_par_jour, 2),
        "nbre_taches_retard": overdue_tasks,
        "nbre_jours_consecutifs_actifs": streak,
        "derniere_date_active": derniere_date,
        "focus_score": normalized_focus_score,
        "meilleur_jour": meilleur_jour,
        "activite_par_jour_semaine": activite_par_jour,
        "date_mise_a_jour": now.isoformat(),
        "tasks_by_status": dict(tasks_by_status),
        "total_tasks": total_tasks,
    }
