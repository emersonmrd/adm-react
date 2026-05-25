interface AlertMessageProps {
  type: "success" | "error";
  message: string | null;
}

const styles = {
  success: "alert-success",
  error: "alert-danger",
};

export default function AlertMessage({ type, message }: AlertMessageProps) {
  if (!message) return null;

  return <p className={styles[type]}>{message}</p>;
}
