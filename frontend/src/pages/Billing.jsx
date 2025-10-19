import { Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

const plans = [
  {
    name: 'Free',
    price: '₺0',
    period: '/ay',
    description: 'Küçük ekipler için başlamak için idealdir',
    features: [
      'Ayda 100 ticket',
      'Email desteği',
      'Temel raporlama',
      '1 kullanıcı',
    ],
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '₺299',
    period: '/ay',
    description: 'Büyüyen ekipler için en iyi seçenek',
    features: [
      'Sınırsız ticket',
      'Öncelikli destek',
      'Gelişmiş raporlama',
      '10 kullanıcıya kadar',
      'AI özellikleri',
      'API erişimi',
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Özel',
    period: '',
    description: 'Büyük kuruluşlar için özellenebilir çözümler',
    features: [
      'Tüm Pro özellikleri',
      'Sınırsız kullanıcı',
      'Özel entegrasyonlar',
      'Hesap yöneticisi',
      'SLA garantisi',
      'Kurumsal destek',
    ],
    highlighted: false,
  },
];

export default function Billing() {
  const handleSelectPlan = (planName) => {
    toast.success(`${planName} planı seçildi (Mock)`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">Abonelik Planları</h1>
        <p className="text-muted-foreground mt-2">
          İhtiyaçlarınıza en uygun planı seçin. İstediğiniz zaman yükseltme veya düşürün.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mt-8">
        {plans.map((plan, idx) => (
          <Card
            key={idx}
            className={`relative transition-all hover:shadow-lg flex flex-col ${
              plan.highlighted
                ? 'border-primary shadow-md scale-105'
                : ''
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-0 right-0 flex justify-center">
                <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  En Popüler
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription className="min-h-[40px]">{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-3 flex-1">
                {plan.features.map((feature, featureIdx) => (
                  <li key={featureIdx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full mt-6"
                variant={plan.highlighted ? 'default' : 'outline'}
                onClick={() => handleSelectPlan(plan.name)}
              >
                {plan.name === 'Enterprise' ? 'İletişime Geç' : 'Planı Seç'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Sıkça Sorulan Sorular</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Planımı istediğim zaman değiştirebilir miyim?</h3>
            <p className="text-sm text-muted-foreground">
              Evet, istediğiniz zaman planınızı yükseltebilir veya düşürebilirsiniz.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-1">Ödeme yöntemleri nelerdir?</h3>
            <p className="text-sm text-muted-foreground">
              Kredi kartı ve banka havalesi ile ödeme yapabilirsiniz.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-1">Deneme süresi var mı?</h3>
            <p className="text-sm text-muted-foreground">
              Pro planı için 14 gün ücretsiz deneme imkanı sunuyoruz.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
