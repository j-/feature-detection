import { useMemo, type FC } from 'react';

interface FeaturePolicy {
  allowedFeatures(): string[];
  allowsFeature(feature: string): boolean;
  features(): string[];
  getAllowlistForFeature(feature: string): string;
}

declare global {
  interface Document {
    featurePolicy?: FeaturePolicy;
  }
}

export const App: FC = () => {
  const features = useMemo(() => {
    if (
      !document.featurePolicy ||
      typeof document.featurePolicy.features !== 'function'
    ) {
      return null;
    }

    try {
      return document.featurePolicy.features().sort();
    } catch {
      return null;
    }
  }, []);

  const allowedFeatures = useMemo(() => {
    if (
      !document.featurePolicy ||
      typeof document.featurePolicy.allowedFeatures !== 'function'
    ) {
      return null;
    }

    try {
      return document.featurePolicy.allowedFeatures();
    } catch {
      return null;
    }
  }, []);
  
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Feature name</th>
            <th>Allowed?</th>
          </tr>
        </thead>

        <tbody>
          {features?.map((feature) => (
            <tr key={feature}>
              <td>{feature}</td>
              <td>{allowedFeatures?.includes(feature) ? '✅' : '❌'} {document.featurePolicy?.getAllowlistForFeature(feature)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
