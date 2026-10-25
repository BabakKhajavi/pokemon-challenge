import type { ButtonHTMLAttributes } from 'react';
import styles from './ContainedButton.module.css';

type ContainedButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const ContainedButton = ({ className, type = 'button', ...props }: ContainedButtonProps) => (
  <button
    {...props}
    type={type}
    className={[styles.button, className].filter(Boolean).join(' ')}
  />
);
