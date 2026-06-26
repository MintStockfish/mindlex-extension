type PasswordVisibilityIconProps = {
  reveal: boolean;
};

export function PasswordVisibilityIcon({
  reveal,
}: PasswordVisibilityIconProps) {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {reveal ? (
        <>
          <path
            d="M2.5 12S5.8 5.75 12 5.75 21.5 12 21.5 12 18.2 18.25 12 18.25 2.5 12 2.5 12Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 15.25A3.25 3.25 0 1 0 12 8.75a3.25 3.25 0 0 0 0 6.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          <path
            d="M3.5 4.5 20.5 19.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M9.4 6.15A8.5 8.5 0 0 1 12 5.75c6.2 0 9.5 6.25 9.5 6.25a16 16 0 0 1-3.2 4.1"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.25 14.55A3.25 3.25 0 0 1 9.45 9.75"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.75 7.75C4 9.55 2.5 12 2.5 12s3.3 6.25 9.5 6.25a8.7 8.7 0 0 0 4.05-.98"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}
