import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

type ShoppingAmount = 500 | 1500 | 2000 | 3000;
type InsuranceAmount = 500 | 1500 | 2500 | 3500 | 4000 | 4500;
type HealthLevel = "athlete" | "active" | "healthier" | "unhealthy" | "ohboy";

interface Selections {
  shopping: ShoppingAmount | null;
  isMember: boolean | null;
  insurance: InsuranceAmount | null;
  healthLevel: HealthLevel | null;
  hasHealthCheck: boolean | null;
  hasScript: boolean | null;
  hasCapitec: boolean | null;
}

const shoppingOptions = [
  { value: 500 as ShoppingAmount, label: "R500", percentage: 25 },
  { value: 1500 as ShoppingAmount, label: "R1,500", percentage: 30 },
  { value: 2000 as ShoppingAmount, label: "R2,000", percentage: 35 },
  { value: 3000 as ShoppingAmount, label: "R3,000", percentage: 40 },
];

const insuranceOptions = [
  { value: 500 as InsuranceAmount, label: "R500", percentage: 20 },
  { value: 1500 as InsuranceAmount, label: "R1,500", percentage: 30 },
  { value: 2500 as InsuranceAmount, label: "R2,500", percentage: 35 },
  { value: 3500 as InsuranceAmount, label: "R3,500", percentage: 40 },
  { value: 4000 as InsuranceAmount, label: "R4,000", percentage: 45 },
  { value: 4500 as InsuranceAmount, label: "R4,500+", percentage: 50 },
];

const healthOptions = [
  { value: "athlete" as HealthLevel, label: "I'm basically an athlete", emoji: "🏆", discount: 500 },
  { value: "active" as HealthLevel, label: "I move… on purpose", emoji: "🏃", discount: 300 },
  { value: "healthier" as HealthLevel, label: "Could be healthier (my shoes agree)", emoji: "🚶", discount: 150 },
  { value: "unhealthy" as HealthLevel, label: "We're on a break, gym and I", emoji: "🛋️", discount: 50 },
  { value: "ohboy" as HealthLevel, label: "Joh joh joh… send help!", emoji: "😅", discount: 0 },
];

export default function RewardsBuilder() {
  const [selections, setSelections] = useState<Selections>({
    shopping: null,
    isMember: null,
    insurance: null,
    healthLevel: null,
    hasHealthCheck: null,
    hasScript: null,
    hasCapitec: null,
  });

  const [glowIntensity, setGlowIntensity] = useState(false);
  const [showFixedTile, setShowFixedTile] = useState(false);
  const [originalTileOpacity, setOriginalTileOpacity] = useState(1);

  const getInsurancePercentage = (insuranceAmount: InsuranceAmount, healthLevel: HealthLevel | null): number => {
    // Default percentages (Health level 1 - "Oh boy")
    const basePercentages: Record<InsuranceAmount, number> = {
      500: 20,
      1500: 30,
      2500: 35,
      3500: 40,
      4000: 45,
      4500: 50,
    };

    // Health level multipliers and specific percentages
    const healthLevelPercentages: Record<HealthLevel, Record<InsuranceAmount, number>> = {
      ohboy: basePercentages, // Level 1 - default
      unhealthy: { // Level 2
        500: 22,
        1500: 32.5,
        2500: 40,
        3500: 45,
        4000: 50,
        4500: 60,
      },
      healthier: { // Level 3
        500: 25,
        1500: 35,
        2500: 45,
        3500: 50,
        4000: 60,
        4500: 70,
      },
      active: { // Level 4
        500: 27.5,
        1500: 40,
        2500: 50,
        3500: 60,
        4000: 70,
        4500: 90,
      },
      athlete: { // Level 5
        500: 30,
        1500: 45,
        2500: 55,
        3500: 70,
        4000: 90,
        4500: 100,
      },
    };

    if (!healthLevel) return basePercentages[insuranceAmount];
    return healthLevelPercentages[healthLevel][insuranceAmount];
  };

  const calculateDiscount = () => {
    // Need shopping amount to calculate discount
    if (!selections.shopping) return 0;

    let discountPercentage = 0;

    // If BetterRewards Member is selected, start with 10% base
    if (selections.isMember === true) {
      discountPercentage = 10;
    }

    // If insurance is selected, replace the base percentage with insurance percentage
    if (selections.insurance) {
      discountPercentage = getInsurancePercentage(selections.insurance, selections.healthLevel);
    }

    // Add 5% boost for pharmacy script
    if (selections.hasScript === true) discountPercentage += 5;

    // Add 5% boost for Capitec account
    if (selections.hasCapitec === true) discountPercentage += 5;

    // Apply the total discount percentage to the shopping amount
    return Math.round((selections.shopping * discountPercentage) / 100);
  };

  const totalDiscount = calculateDiscount();

  // Reusable discount tile content
  const DiscountTileContent = () => (
    <>
      <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">You'll be saving</h2>
      <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-white transition-all duration-500 mb-3 break-words">
        R{totalDiscount.toLocaleString()}
      </div>
      <div className="text-2xl md:text-3xl font-bold mt-3 text-white">every month<span className="font-normal">*</span></div>
      <div className="text-2xl md:text-3xl font-bold text-white">while protecting your loved ones</div>
      {selections.hasHealthCheck === true && (
        <Badge className="mt-4 bg-accent text-accent-foreground border-0">
          + Free HealthCheck
        </Badge>
      )}
    </>
  );

  // Trigger glow animation when discount changes
  useEffect(() => {
    setGlowIntensity(true);
    const timer = setTimeout(() => {
      setGlowIntensity(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [totalDiscount]);

  // Handle scroll for mobile sticky tile
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fadeStartPoint = windowHeight * 0.5; // Start fading earlier
      const fadeEndPoint = windowHeight * 0.7;   // Complete fade later

      if (window.innerWidth < 1024) { // Only on mobile/tablet
        if (scrollY <= fadeStartPoint) {
          // Before fade zone - original tile fully visible
          setOriginalTileOpacity(1);
          setShowFixedTile(false);
        } else if (scrollY >= fadeEndPoint) {
          // After fade zone - fixed tile fully visible
          setOriginalTileOpacity(0);
          setShowFixedTile(true);
        } else {
          // In fade zone - calculate opacity based on scroll position
          const fadeProgress = (scrollY - fadeStartPoint) / (fadeEndPoint - fadeStartPoint);
          const opacity = Math.max(0, Math.min(1, 1 - fadeProgress));

          setOriginalTileOpacity(opacity);
          setShowFixedTile(fadeProgress > 0.5); // Show fixed tile when halfway through fade
        }
      } else {
        // Desktop - reset to default state
        setOriginalTileOpacity(1);
        setShowFixedTile(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(to top, #F0F0F0 0%, #FFFFFF 100%)',
        fontFamily: 'Montserrat, Helvetica, Arial, sans-serif'
      }}
    >
      {/* Fixed Mobile Discount Tile */}
      {showFixedTile && (
        <div className="fixed top-4 left-4 right-4 z-50 lg:hidden animate-in fade-in duration-300">
          <div className="relative">
            {/* Gradient Glow Background */}
            <div
              className={`absolute inset-0 rounded-2xl blur-lg transition-all duration-800 ease-in ${glowIntensity ? 'opacity-0' : 'opacity-[0.24]'
                }`}
              style={{
                background: 'var(--gradient-primary)',
                transform: 'scale(1.05)'
              }}
            />

            {/* Main Tile */}
            <div
              className="relative rounded-2xl p-6 shadow-elegant border-2 border-primary/20"
              style={{
                background: 'linear-gradient(135deg, #006B3A 0%, #04411F 100%)'
              }}
            >
              <DiscountTileContent />
            </div>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-left">
            <Badge className="mb-4 bg-accent text-accent-foreground border-0">
              BetterRewards
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight pb-2">
              Your rewards just<br />got better!
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Let's help you save more everyday.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content with Sticky Discount */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_400px] gap-8 items-start">
            {/* Configuration Options */}
            <div className="space-y-16 order-2 lg:order-1">
              {/* Shopping Amount */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">How much do you spend<br />at Dis-Chem?</h2>
                  <p className="text-muted-foreground">Select your typical monthly spend</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {shoppingOptions.map((option) => (
                    <Card
                      key={option.value}
                      className={`relative p-6 cursor-pointer transition-all duration-300 hover:shadow-hover hover:-translate-y-1 ${selections.shopping === option.value
                        ? "border-primary bg-accent shadow-hover"
                        : "border-border hover:border-primary/50"
                        }`}
                      onClick={() => setSelections({
                        ...selections,
                        shopping: selections.shopping === option.value ? null : option.value
                      })}
                    >
                      {selections.shopping === option.value && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                      <div className="text-2xl font-bold text-foreground mb-1">{option.label}</div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border"></div>

              {/* BetterRewards Member */}
              <div className="space-y-4">
                <div className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight pb-2">
                  Enjoy 10% just<br />for being part of BetterRewards
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Card
                    className={`relative p-8 cursor-pointer transition-all duration-300 hover:shadow-hover hover:-translate-y-1 col-span-2 ${selections.isMember === true
                      ? "border-primary bg-accent shadow-hover"
                      : "border-border hover:border-primary/50"
                      }`}
                    onClick={() => setSelections({ ...selections, isMember: !selections.isMember })}
                  >
                    {selections.isMember === true && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    <div className="text-2xl font-bold text-foreground">BetterRewards Member</div>
                  </Card>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border"></div>

              {/* Life Insurance */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">How much do you pay on life and<br />funeral cover?</h2>
                  <p className="text-muted-foreground">Your combined monthly premium</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {insuranceOptions.map((option) => (
                    <Card
                      key={option.value}
                      className={`relative p-6 cursor-pointer transition-all duration-300 hover:shadow-hover hover:-translate-y-1 ${selections.insurance === option.value
                        ? "border-primary bg-accent shadow-hover"
                        : "border-border hover:border-primary/50"
                        }`}
                      onClick={() => setSelections({
                        ...selections,
                        insurance: selections.insurance === option.value ? null : option.value
                      })}
                    >
                      {selections.insurance === option.value && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                      <div className="text-2xl font-bold text-foreground mb-1">{option.label}</div>
                      <div className="text-sm text-primary font-medium">
                        {getInsurancePercentage(option.value, selections.healthLevel)}% back
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border"></div>

              {/* Health Level */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">How healthy are you?</h2>
                  <p className="text-muted-foreground">Most people agree they can be healthier</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {healthOptions.map((option) => (
                    <Card
                      key={option.value}
                      className={`relative p-6 cursor-pointer transition-all duration-300 hover:shadow-hover hover:-translate-y-1 ${selections.healthLevel === option.value
                        ? "border-primary bg-accent shadow-hover"
                        : "border-border hover:border-primary/50"
                        }`}
                      onClick={() => setSelections({
                        ...selections,
                        healthLevel: selections.healthLevel === option.value ? null : option.value
                      })}
                    >
                      {selections.healthLevel === option.value && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                      <div className="text-4xl mb-3">{option.emoji}</div>
                      <div className="text-sm font-medium text-foreground mb-2">{option.label}</div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border"></div>

              {/* HealthCheck */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Card
                    className={`relative p-8 cursor-pointer transition-all duration-300 hover:shadow-hover hover:-translate-y-1 col-span-2 ${selections.hasHealthCheck === true
                      ? "border-primary bg-accent shadow-hover"
                      : "border-border hover:border-primary/50"
                      }`}
                    onClick={() => setSelections({ ...selections, hasHealthCheck: !selections.hasHealthCheck })}
                  >
                    {selections.hasHealthCheck === true && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    <div className="text-2xl md:text-3xl font-bold text-foreground mb-2">How about a free HealthCheck every year?</div>
                    <div className="text-sm text-primary font-medium">Valued at R1,200</div>
                  </Card>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border"></div>

              {/* Toggle Options */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Pharmacy Script */}
                <Card
                  className={`relative p-8 cursor-pointer transition-all duration-300 hover:shadow-hover hover:-translate-y-1 ${selections.hasScript === true
                    ? "border-primary bg-accent shadow-hover"
                    : "border-border hover:border-primary/50"
                    }`}
                  onClick={() => setSelections({ ...selections, hasScript: !selections.hasScript })}
                >
                  {selections.hasScript === true && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  <div className="text-2xl font-bold text-foreground mb-2">Do you visit a pharmacy every month?</div>
                  <div className="text-sm text-primary font-medium">+5% boost</div>
                </Card>

                {/* Capitec Banking */}
                <Card
                  className={`relative p-8 cursor-pointer transition-all duration-300 hover:shadow-hover hover:-translate-y-1 ${selections.hasCapitec === true
                    ? "border-primary bg-accent shadow-hover"
                    : "border-border hover:border-primary/50"
                    }`}
                  onClick={() => setSelections({ ...selections, hasCapitec: !selections.hasCapitec })}
                >
                  {selections.hasCapitec === true && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  <div className="text-2xl font-bold text-foreground mb-2">Do you pay with a Capitec account?</div>
                  <div className="text-sm text-primary font-medium">+5% boost</div>
                </Card>
              </div>
            </div>

            {/* Sticky Discount Display */}
            <div
              className="order-1 lg:order-2 lg:sticky lg:top-8 lg:self-start mb-8 lg:mb-0"
              style={{ opacity: originalTileOpacity }}
            >
              <div className="relative">
                {/* Gradient Glow Background */}
                <div
                  className={`absolute inset-0 rounded-2xl blur-lg transition-all duration-800 ease-in ${glowIntensity ? 'opacity-0' : 'opacity-[0.24]'
                    }`}
                  style={{
                    background: 'var(--gradient-primary)',
                    transform: 'scale(1.05)'
                  }}
                />

                {/* Main Tile */}
                <div
                  className="relative rounded-2xl p-8 lg:p-12 shadow-elegant border-2 border-primary/20"
                  style={{
                    background: 'linear-gradient(135deg, #006B3A 0%, #04411F 100%)'
                  }}
                >
                  <DiscountTileContent />
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-4 text-xs leading-relaxed font-thin" style={{ color: '#A5A5A5' }}>
                Dis-Chem Life is an authorised FSP, No 50594. Products are underwritten by Guardrisk Life Limited, a licensed life insurer (FSP No 76). T&Cs apply. For full policy T&Cs & more info, visit www.dischemlife.co.za.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
