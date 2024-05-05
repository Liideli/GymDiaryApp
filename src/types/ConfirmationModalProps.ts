type ConfirmationModalProps = {
  show: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export type { ConfirmationModalProps };