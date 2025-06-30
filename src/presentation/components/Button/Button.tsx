import React from "react";
import styles from "./Button.module.css";

export type ButtonTheme = "primary" | "danger" | "default";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  theme?: ButtonTheme;
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  theme = "default",
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      className={[
        styles.button,
        theme === "primary" ? styles.primary : "",
        theme === "danger" ? styles.danger : "",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
