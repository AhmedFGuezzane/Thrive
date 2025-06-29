// src/components/common/ErrorBoundary.jsx
import React from "react";
import { Alert, AlertTitle } from "@mui/material";
import { useTranslation } from "react-i18next";

class ErrorBoundaryInner extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
    // Optional: send error to logging server here
  }

  render() {
    const { t } = this.props;

    if (this.state.hasError) {
      return (
        <Alert severity="error" sx={{ m: 4 }}>
          <AlertTitle>{t("errorBoundary.title")}</AlertTitle>
          {this.state.error?.message || t("errorBoundary.defaultMessage")}
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default function ErrorBoundaryWrapper({ children }) {
  const { t } = useTranslation();

  return <ErrorBoundaryInner t={t}>{children}</ErrorBoundaryInner>;
}
