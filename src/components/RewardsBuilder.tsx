import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

type ShoppingAmount = 500 | 1000 | 2000 | 3000 | 4500;
type InsuranceAmount = 500 | 1000 | 2000 | 3000 | 4500;
type HealthLevel = "athlete" | "active" | "healthier" | "unhealthy" | "ohboy";

interface Selections {
  shopping: ShoppingAmount | null;
  insurance: InsuranceAmount | null;
  healthLevel: HealthLevel | null;
  hasScript: boolean | null;
  hasCapitec: boolean | null;
}

const shoppingOptions = [
  { value: 500 as ShoppingAmount, label: "R500", discount: 50 },
  { value: 1000 as ShoppingAmount, label: "R1,000", discount: 120 },
  { value: 2000 as ShoppingAmount, label: "R2,000", discount: 250 },
  { value: 3000 as ShoppingAmount, label: "R3,000", discount: 400 },
  { value: 4500 as ShoppingAmount, label: "R4,500+", discount: 650 },
];

const insuranceOptions = [
  { value: 500 as InsuranceAmount, label: "R500", discount: 80 },
  { value: 1000 as InsuranceAmount, label: "R1,000", discount: 180 },
  { value: 2000 as InsuranceAmount, label: "R2,000", discount: 380 },
  { value: 3000 as InsuranceAmount, label: "R3,000", discount: 600 },
  { value: 4500 as InsuranceAmount, label: "R4,500+", discount: 900 },
];

const healthOptions = [
  { value: "athlete" as HealthLevel, label: "I'm a professional athlete", emoji: "🏆", discount: 500 },
  { value: "active" as HealthLevel, label: "I'm active", emoji: "🏃", discount: 300 },
  { value: "healthier" as HealthLevel, label: "Can be healthier", emoji: "🚶", discount: 150 },
  { value: "unhealthy" as HealthLevel, label: "I'm not healthy", emoji: "🛋️", discount: 50 },
  { value: "ohboy" as HealthLevel, label: "Oh boy", emoji: "😅", discount: 0 },
];

export default function RewardsBuilder() {
  const [selections, setSelections] = useState<Selections>({
    shopping: null,
    insurance: null,
    healthLevel: null,
    hasScript: null,
    hasCapitec: null,
  });

  const calculateDiscount = () => {
    let total = 0;

    if (selections.shopping) {
      const option = shoppingOptions.find((opt) => opt.value === selections.shopping);
      if (option) total += option.discount;
    }

    if (selections.insurance) {
      const option = insuranceOptions.find((opt) => opt.value === selections.insurance);
      if (option) total += option.discount;
    }

    if (selections.healthLevel) {
      const option = healthOptions.find((opt) => opt.value === selections.healthLevel);
      if (option) total += option.discount;
    }

    if (selections.hasScript === true) total += 200;
    if (selections.hasCapitec === true) total += 150;

    return total;
  };

  const totalDiscount = calculateDiscount();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <Badge className="mb-4 bg-accent text-accent-foreground border-0">
              Rewards Program Builder
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Build Your Perfect Rewards Package
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Select your preferences and watch your discount grow in real-time
            </p>
          </div>
        </div>
      </section>

      {/* Main Content with Sticky Discount */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_300px] gap-8">
            {/* Configuration Options */}
            <div className="space-y-12 order-2 lg:order-1">
            {/* Shopping Amount */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Monthly Shopping at Dis-Chem</h2>
                <p className="text-muted-foreground">Select your typical monthly spend</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {shoppingOptions.map((option) => (
                  <Card
                    key={option.value}
                    className={`relative p-6 cursor-pointer transition-all duration-300 hover:shadow-hover hover:-translate-y-1 ${
                      selections.shopping === option.value
                        ? "border-primary bg-accent shadow-hover"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelections({ ...selections, shopping: option.value })}
                  >
                    {selections.shopping === option.value && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    <div className="text-2xl font-bold text-foreground mb-1">{option.label}</div>
                    <div className="text-sm text-primary font-medium">+R{option.discount}</div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Life Insurance */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Current Spend on Life Insurance</h2>
                <p className="text-muted-foreground">Your monthly life insurance premium</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {insuranceOptions.map((option) => (
                  <Card
                    key={option.value}
                    className={`relative p-6 cursor-pointer transition-all duration-300 hover:shadow-hover hover:-translate-y-1 ${
                      selections.insurance === option.value
                        ? "border-primary bg-accent shadow-hover"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelections({ ...selections, insurance: option.value })}
                  >
                    {selections.insurance === option.value && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    <div className="text-2xl font-bold text-foreground mb-1">{option.label}</div>
                    <div className="text-sm text-primary font-medium">+R{option.discount}</div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Health Level */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Health Level</h2>
                <p className="text-muted-foreground">How would you describe your fitness level?</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {healthOptions.map((option) => (
                  <Card
                    key={option.value}
                    className={`relative p-6 cursor-pointer transition-all duration-300 hover:shadow-hover hover:-translate-y-1 ${
                      selections.healthLevel === option.value
                        ? "border-primary bg-accent shadow-hover"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelections({ ...selections, healthLevel: option.value })}
                  >
                    {selections.healthLevel === option.value && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    <div className="text-4xl mb-3">{option.emoji}</div>
                    <div className="text-sm font-medium text-foreground mb-2">{option.label}</div>
                    <div className="text-sm text-primary font-medium">+R{option.discount}</div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Yes/No Options */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pharmacy Script */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Monthly Pharmacy Script?</h2>
                  <p className="text-muted-foreground">Do you have a regular prescription?</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Card
                    className={`relative p-8 cursor-pointer transition-all duration-300 hover:shadow-hover hover:-translate-y-1 ${
                      selections.hasScript === true
                        ? "border-primary bg-accent shadow-hover"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelections({ ...selections, hasScript: true })}
                  >
                    {selections.hasScript === true && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    <div className="text-2xl font-bold text-foreground mb-1">Yes</div>
                    <div className="text-sm text-primary font-medium">+R200</div>
                  </Card>
                  <Card
                    className={`relative p-8 cursor-pointer transition-all duration-300 hover:shadow-hover hover:-translate-y-1 ${
                      selections.hasScript === false
                        ? "border-primary bg-accent shadow-hover"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelections({ ...selections, hasScript: false })}
                  >
                    {selections.hasScript === false && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    <div className="text-2xl font-bold text-foreground mb-1">No</div>
                    <div className="text-sm text-muted-foreground">+R0</div>
                  </Card>
                </div>
              </div>

              {/* Capitec Banking */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Bank with Capitec?</h2>
                  <p className="text-muted-foreground">Are you a Capitec customer?</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Card
                    className={`relative p-8 cursor-pointer transition-all duration-300 hover:shadow-hover hover:-translate-y-1 ${
                      selections.hasCapitec === true
                        ? "border-primary bg-accent shadow-hover"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelections({ ...selections, hasCapitec: true })}
                  >
                    {selections.hasCapitec === true && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    <div className="text-2xl font-bold text-foreground mb-1">Yes</div>
                    <div className="text-sm text-primary font-medium">+R150</div>
                  </Card>
                  <Card
                    className={`relative p-8 cursor-pointer transition-all duration-300 hover:shadow-hover hover:-translate-y-1 ${
                      selections.hasCapitec === false
                        ? "border-primary bg-accent shadow-hover"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelections({ ...selections, hasCapitec: false })}
                  >
                    {selections.hasCapitec === false && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    <div className="text-2xl font-bold text-foreground mb-1">No</div>
                    <div className="text-sm text-muted-foreground">+R0</div>
                  </Card>
                </div>
              </div>
              </div>
            </div>

            {/* Sticky Discount Display */}
            <div className="order-1 lg:order-2">
              <div className="sticky top-8 z-10 bg-card rounded-2xl p-6 shadow-card border border-border">
                <div className="text-muted-foreground text-xs uppercase tracking-wide mb-2">
                  Your Total Discount
                </div>
                <div className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent transition-all duration-500">
                  R{totalDiscount.toLocaleString()}
                </div>
                <div className="text-muted-foreground text-xs mt-2">per month</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
