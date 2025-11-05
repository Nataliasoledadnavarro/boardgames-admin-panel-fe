import { useState } from 'react';

interface UseModalProps {
  defaultOpen?: boolean;
}

interface UseModalReturn<T> {
  isOpen: boolean;
  selectedItem: T | null;
  open: () => void;
  openWith: (item: T) => void;
  close: () => void;
  toggle: () => void;
  isEditing: boolean;
}

export function useModal<T = unknown>(props: UseModalProps = {}): UseModalReturn<T> {
  const { defaultOpen = false } = props;

  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const open = (): void => {
    setSelectedItem(null);
    setIsOpen(true);
  };

  const openWith = (item: T): void => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  const close = (): void => {
    setIsOpen(false);
    setSelectedItem(null);
  };

  const toggle = (): void => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  };

  const isEditing: boolean = selectedItem !== null;

  return {
    isOpen,
    selectedItem,
    open,
    openWith,
    close,
    toggle,
    isEditing,
  };
}

// Helper types para mejor DX
export type ModalState<T> = UseModalReturn<T>;
export type ModalActions<T> = Pick<UseModalReturn<T>, 'open' | 'openWith' | 'close' | 'toggle'>;

// Type guards para runtime safety
export const isEditingModal = <T>(
  modal: UseModalReturn<T>
): modal is UseModalReturn<T> & { selectedItem: T } => {
  return modal.selectedItem !== null;
};
