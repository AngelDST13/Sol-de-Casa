import { Link } from 'react-router-dom';
import styles from './Button.module.css';

/**
 * Botón o enlace con el mismo aspecto. variant: sun | dark | ghost | light | green. size: md | lg.
 */
export const Button = ({
  to,
  href,
  variant = 'sun',
  size = 'md',
  block = false,
  className = '',
  children,
  ...rest
}) => {
  const props = {
    className: `${styles.button} ${className}`,
    'data-variant': variant,
    'data-size': size,
    'data-block': block,
    ...rest,
  };
  if (to)
    return (
      <Link to={to} {...props}>
        {children}
      </Link>
    );
  if (href)
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  return (
    <button type="button" {...props}>
      {children}
    </button>
  );
};
