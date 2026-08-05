import { useTheme } from '../store/theme.store';

interface ThemeBrandIconProps {
  alt: string;
  className?: string;
  lightOnPrint?: boolean;
}

export function ThemeBrandIcon({ alt, className = '', lightOnPrint = false }: ThemeBrandIconProps) {
  const theme = useTheme((state) => state.theme);

  return (
    <>
      <img
        src={theme === 'dark' ? '/icon-infarma.png' : '/favicon.svg'}
        alt={alt}
        className={`${className} ${lightOnPrint ? 'print:hidden' : ''}`}
      />
      {lightOnPrint && (
        <img
          src="/favicon.svg"
          alt=""
          aria-hidden="true"
          className={`${className} hidden print:block`}
        />
      )}
    </>
  );
}
