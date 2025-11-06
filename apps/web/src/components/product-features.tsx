import { SpecificationsTable } from '@/types/products';
import { useTranslations } from 'next-intl';

type ProductFeaturesProps = {
  specificationsTable: SpecificationsTable
};

export default function ProductFeatures({
  specificationsTable,
}: ProductFeaturesProps) {
  const t = useTranslations('productFeatures');

  return (
    <div className="mt-6">
      <h2 className="sm:text-2xl text-xl font-semibold mb-3">{t('title')}</h2>
      <ul>
        <li className="text-muted-foreground md:text-lg text-[1.1rem] md:leading-9 leading-6 tracking-wide">
          <strong>{t('energy.title')} </strong>
          {t('energy.desc', { saving: specificationsTable['Energy Saving'] })}
        </li>
        <li className="text-muted-foreground md:text-lg text-[1.1rem] md:leading-9 leading-6 tracking-wide">
          <strong>{t('lifetime.title')} </strong>
          {t('lifetime.desc', { lifetime: specificationsTable['Life Time'] })}
        </li>
        <li className="text-muted-foreground md:text-lg text-[1.1rem] md:leading-9 leading-6 tracking-wide">
          {parseInt(specificationsTable['IP']) >= 44
            ? <strong>{t('weatherproof.title')}</strong>
            : <strong>{t('indoor.title')}</strong>
          }
          {parseInt(specificationsTable['IP']) >= 44
            ? t('weatherproof.desc', { ip: specificationsTable['IP'] })
            : t('indoor.desc', { ip: specificationsTable['IP'] })
          }
        </li>
        <li className="text-muted-foreground md:text-lg text-[1.1rem] md:leading-9 leading-6 tracking-wide">
          <strong>{t('brightness.title')}</strong>
          {t('brightness.desc', { lumens: specificationsTable['Luminous Flux'] })}
        </li>
        <li className="text-muted-foreground md:text-lg text-[1.1rem] md:leading-9 leading-6 tracking-wide">
          <strong>{t('beam.title')}</strong>
          {t('beam.desc', { angle: specificationsTable['Beam Angle'] })}
        </li>
        <li className="text-muted-foreground md:text-lg text-[1.1rem] md:leading-9 leading-6 tracking-wide">
          <strong>{t('temperature.title')}</strong>
          {t('temperature.desc', { range: specificationsTable['Working Temperature'] })}
        </li>
        <li className="text-muted-foreground md:text-lg text-[1.1rem] md:leading-9 leading-6 tracking-wide">
          <strong>{t('cri.title')}</strong>
          {t('cri.desc')}
        </li>
        <li className="text-muted-foreground md:text-lg text-[1.1rem] md:leading-9 leading-6 tracking-wide">
          <strong>{t('installation.title')}</strong>
          {t('installation.desc')}
        </li>
        <li className="text-muted-foreground md:text-lg text-[1.1rem] md:leading-9 leading-6 tracking-wide">
          <strong>{t('durability.title')}</strong>
          {t('durability.desc')}
        </li>
      </ul>
    </div>
  );
}
