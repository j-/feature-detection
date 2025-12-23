import { useEffect, useMemo, useState, type FC } from 'react';

export type PermissionStateProps = {
  feature: string;
};

export const PermissionState: FC<PermissionStateProps> = ({ feature }) => {
  const [state, setState] = useState<PermissionState | 'unsupported'>(
    'unsupported'
  );

  const [status, setStatus] = useState<PermissionStatus | null>(null);

  const icon = useMemo(() => {
    switch (state) {
      case 'granted':
        return '✅';
      case 'denied':
        return '❌';
      case 'prompt':
        return '⚠️';
      case 'unsupported':
      default:
        return '❓';
    }
  }, [state]);

  useEffect(() => {
    let isMounted = true;

    if (!navigator.permissions || !navigator.permissions.query) {
      setState('unsupported');
      return;
    }

    navigator.permissions
      .query({
        name: feature,
      } as PermissionDescriptor)
      .then((permissionStatus) => {
        if (isMounted) {
          setStatus(permissionStatus);
        }
      })
      .catch(() => {
        if (isMounted) {
          setState('unsupported');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [feature]);

  useEffect(() => {
    if (!status) return;

    setState(status.state);

    const handleChange = () => {
      setState(status.state);
    };

    status.addEventListener('change', handleChange);

    return () => {
      status.removeEventListener('change', handleChange);
    };
  }, [status]);

  return <span>{icon} {state}</span>;
};
