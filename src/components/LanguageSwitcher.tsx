import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales } from '../i18n';

interface LanguageSwitcherProps {
    className?: string;
}

/**
 * مكون لتبديل اللغات
 * يمكن استخدامه في أي مكان في التطبيق
 */
export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
    const pathname = usePathname();

    // استخراج المسار الحالي بدون معرف اللغة
    const getPathWithoutLocale = () => {
        const segments = pathname.split('/');
        // تخطي الجزء الأول (فارغ) والجزء الثاني (معرف اللغة)
        segments.splice(0, 2);
        return '/' + segments.join('/');
    };

    // الحصول على المسار الحالي بدون اللغة
    const currentPath = getPathWithoutLocale();

    return (
        <div className={`flex gap-3 ${className}`}>
            {locales.map((locale) => (
                <Link
                    key={locale}
                    href={currentPath}
                    locale={locale}
                    className="px-3 py-1 border rounded-md hover:bg-gray-100 transition-colors"
                >
                    {locale === 'ar' ? 'العربية' : 'English'}
                </Link>
            ))}
        </div>
    );
} 