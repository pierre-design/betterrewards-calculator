import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Check, ChevronRight } from "lucide-react";

type ShoppingAmount = 500 | 1500 | 2000 | 3000 | 'custom';
type InsuranceAmount = 500 | 1500 | 2500 | 3500 | 4000 | 4500 | 'custom';
type HealthLevel = "athlete" | "active" | "healthier" | "unhealthy" | "ohboy";

interface Selections {
  shopping: ShoppingAmount | null;
  customAmount: number | null;
  isMember: boolean | null;
  insurance: InsuranceAmount | null;
  customInsuranceAmount: number | null;
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
  { value: 'custom' as ShoppingAmount, label: "Add own amount", percentage: 0 },
];

const insuranceOptions = [
  { value: 500 as InsuranceAmount, label: "R500", percentage: 20 },
  { value: 1500 as InsuranceAmount, label: "R1,500", percentage: 30 },
  { value: 2500 as InsuranceAmount, label: "R2,500", percentage: 35 },
  { value: 3500 as InsuranceAmount, label: "R3,500", percentage: 40 },
  { value: 4000 as InsuranceAmount, label: "R4,000", percentage: 45 },
  { value: 4500 as InsuranceAmount, label: "R4,500+", percentage: 50 },
  { value: 'custom' as InsuranceAmount, label: "Add own amount", percentage: 0 },
];

const healthOptions = [
  { value: "athlete" as HealthLevel, label: "Fit and feeling good.", emoji: "🏆", discount: 500 },
  { value: "active" as HealthLevel, label: "I move… on purpose", emoji: "🏃", discount: 300 },
  { value: "healthier" as HealthLevel, label: "Could be healthier (my shoes agree)", emoji: "🚶", discount: 150 },
  { value: "unhealthy" as HealthLevel, label: "We're on a break, gym and I", emoji: "🛋️", discount: 50 },
  { value: "ohboy" as HealthLevel, label: "Joh joh joh… send help!", emoji: "😅", discount: 0 },
];

export default function RewardsBuilder() {
  const [selections, setSelections] = useState<Selections>({
    shopping: null,
    customAmount: null,
    isMember: null,
    insurance: null,
    customInsuranceAmount: null,
    healthLevel: null,
    hasHealthCheck: null,
    hasScript: null,
    hasCapitec: null,
  });

  const [glowIntensity, setGlowIntensity] = useState(false);
  const [showFixedTile, setShowFixedTile] = useState(false);
  const [originalTileOpacity, setOriginalTileOpacity] = useState(1);
  const [imageOpacity, setImageOpacity] = useState(1);
  const [ctaButtonOpacity, setCtaButtonOpacity] = useState(0);
  const [disclaimerOffset, setDisclaimerOffset] = useState(0);
  const [ctaButtonOffset, setCtaButtonOffset] = useState(0);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [selectedSubBox, setSelectedSubBox] = useState<number | null>(null);
  const [showSubBoxModal, setShowSubBoxModal] = useState(false);
  const [healthBoxesSticky, setHealthBoxesSticky] = useState(false);
  const [visibleSubBoxes, setVisibleSubBoxes] = useState(0);
  const [subBoxFadeOpacity, setSubBoxFadeOpacity] = useState<Record<number, number>>({});
  const [isMobile, setIsMobile] = useState(false);
  const [fixedTileOpacity, setFixedTileOpacity] = useState(1);


  const subBoxes = [
    {
      id: 1,
      title: "One HealthCheck to kick things off. Simple enough, right?",
      subtitle: "",
      hasStack: false,
      modalTitle: "Health Check",
      modalDescription: "A twenty-minute personality quiz in disguise. You'll be asked everything from how many salads you've eaten this week to how zen you feel about traffic. Points for honesty (but not too much)."
    },
    {
      id: 2,
      title: "Complete a Health Age quiz",
      subtitle: "",
      hasStack: false,
      modalTitle: "Age Assessment",
      modalDescription: "Because one self-reflection isn't enough. Twice a year, you'll rate your stress, sleep, and mood. Miss one and you might lose more points than you gain from that \"mindful\" weekend."
    },
    {
      id: 3,
      title: "Do a Mental Health Test.",
      subtitle: "",
      hasStack: false,
      modalTitle: "Mental Wellbeing Assessment",
      modalDescription: "An online quiz measuring stress, mood, and resilience that must be completed twice a year."
    },
    {
      id: 4,
      title: "More tests…like a dental check up",
      subtitle: "",
      hasStack: false,
      modalTitle: "Preventative Screenings",
      modalDescription: "Colonoscopy, Pap smear, flu jab, dental check, repeat. Each visit earns a few points and costs you a few hours (and possibly your dignity)."
    },
    {
      id: 5,
      title: "Go to the gym. A hundred times.",
      subtitle: "",
      hasStack: false,
      modalTitle: "Gym Visits",
      modalDescription: "100 gym sessions a year or it didn't happen. Skip a week? There goes your discount. Better hope your smartwatch counts that mall dash as cardio."
    },
    {
      id: 6,
      title: "Close all your activity rings. Every. Single. Week. Except for two.",
      subtitle: "",
      hasStack: false,
      modalTitle: "Active Rewards Goals",
      modalDescription: "Move 50 weeks a year. Every week. Your steps, heart rate, and activity must sync perfectly with your device. One tech glitch and it's \"try again next week.\""
    },
    {
      id: 7,
      title: "Still here? Great! Complete another Mental Health Test.",
      subtitle: "",
      hasStack: false,
      modalTitle: "Mental Wellbeing Assessment",
      modalDescription: "Two weekend runs because jogging in circles builds character. Miss one? You'll be chasing points instead of medals."
    },
    {
      id: 8,
      title: "Run a parkrun.",
      subtitle: "",
      hasStack: false,
      modalTitle: "Parkrun or Races",
      modalDescription: "Two weekend runs because jogging in circles builds character. Miss one? You'll be chasing points instead of medals."
    },
    {
      id: 9,
      title: "Healthy food or nothing. Your trolley decides your points.",
      subtitle: "",
      hasStack: false,
      modalTitle: "HealthyFood Spend",
      modalDescription: "Buy kale to earn points. Buy cake, lose your moral standing. Every grocery run becomes a moral dilemma between rewards and rusks."
    },
    {
      id: 10,
      title: "Sync your wearable. Let it track your every move.",
      subtitle: "",
      hasStack: false,
      modalTitle: "Wearable Tracking",
      modalDescription: "Connect your fitness tracker and let it monitor everything you do. Every step, every heartbeat, every moment of inactivity - it's all being watched and judged."
    },
    {
      id: 11,
      title: "Review your progress. Realise you're still not top Top status.",
      subtitle: "",
      hasStack: false,
      modalTitle: "Progress Review",
      modalDescription: "Time to check if all that effort paid off. Spoiler alert: you're probably still not Diamond status, but hey, at least you tried!"
    }
  ];

  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [showCustomInsuranceModal, setShowCustomInsuranceModal] = useState(false);
  const [customInsuranceInput, setCustomInsuranceInput] = useState('');

  const getInsurancePercentage = (insuranceAmount: InsuranceAmount, healthLevel: HealthLevel | null, customAmount?: number | null): number => {
    // Default percentages (Health level 1 - "Oh boy")
    const basePercentages: Record<InsuranceAmount, number> = {
      500: 20,
      1500: 30,
      2500: 35,
      3500: 40,
      4000: 45,
      4500: 50,
      custom: 0,
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
        custom: 0,
      },
      healthier: { // Level 3
        500: 25,
        1500: 35,
        2500: 45,
        3500: 50,
        4000: 60,
        4500: 70,
        custom: 0,
      },
      active: { // Level 4
        500: 27.5,
        1500: 40,
        2500: 50,
        3500: 60,
        4000: 70,
        4500: 90,
        custom: 0,
      },
      athlete: { // Level 5
        500: 30,
        1500: 45,
        2500: 55,
        3500: 70,
        4000: 90,
        4500: 100,
        custom: 0,
      },
    };

    // Handle custom insurance amounts
    if (insuranceAmount === 'custom') {
      if (!customAmount) return 0;
      // Calculate percentage based on custom amount tiers
      if (customAmount >= 4500) return healthLevel ? healthLevelPercentages[healthLevel][4500] : basePercentages[4500];
      if (customAmount >= 4000) return healthLevel ? healthLevelPercentages[healthLevel][4000] : basePercentages[4000];
      if (customAmount >= 3500) return healthLevel ? healthLevelPercentages[healthLevel][3500] : basePercentages[3500];
      if (customAmount >= 2500) return healthLevel ? healthLevelPercentages[healthLevel][2500] : basePercentages[2500];
      if (customAmount >= 1500) return healthLevel ? healthLevelPercentages[healthLevel][1500] : basePercentages[1500];
      return healthLevel ? healthLevelPercentages[healthLevel][500] : basePercentages[500];
    }

    if (!healthLevel) return basePercentages[insuranceAmount];
    return healthLevelPercentages[healthLevel][insuranceAmount];
  };

  const calculateDiscount = () => {
    // Need shopping amount to calculate discount
    if (!selections.shopping) return 0;

    // Get the actual shopping amount (custom or predefined)
    const actualShoppingAmount = selections.shopping === 'custom'
      ? selections.customAmount || 0
      : selections.shopping;

    if (actualShoppingAmount === 0) return 0;

    let discountPercentage = 0;

    // If BetterRewards Member is selected, start with 10% base
    if (selections.isMember === true) {
      discountPercentage = 10;
    }

    // If insurance is selected, replace the base percentage with insurance percentage
    if (selections.insurance) {
      const insuranceAmount = selections.insurance === 'custom'
        ? selections.customInsuranceAmount
        : selections.insurance;
      discountPercentage = getInsurancePercentage(selections.insurance, selections.healthLevel, selections.customInsuranceAmount);
    }

    // Add 5% boost for pharmacy script
    if (selections.hasScript === true) discountPercentage += 5;

    // Add 5% boost for Capitec account
    if (selections.hasCapitec === true) discountPercentage += 5;

    // Cap the maximum discount percentage at 100%
    discountPercentage = Math.min(discountPercentage, 100);

    // Apply the total discount percentage to the shopping amount
    const calculatedDiscount = Math.round((actualShoppingAmount * discountPercentage) / 100);

    // Cap the maximum discount at R3,000 per month
    return Math.min(calculatedDiscount, 3000);
  };

  const totalDiscount = calculateDiscount();

  const getCurrentDiscountPercentage = () => {
    if (!selections.shopping) return 0;

    let discountPercentage = 0;

    // If BetterRewards Member is selected, start with 10% base
    if (selections.isMember === true) {
      discountPercentage = 10;
    }

    // If insurance is selected, replace the base percentage with insurance percentage
    if (selections.insurance) {
      discountPercentage = getInsurancePercentage(selections.insurance, selections.healthLevel, selections.customInsuranceAmount);
    }

    // Add 5% boost for pharmacy script
    if (selections.hasScript === true) discountPercentage += 5;

    // Add 5% boost for Capitec account
    if (selections.hasCapitec === true) discountPercentage += 5;

    // Cap the maximum discount percentage at 100%
    return Math.min(discountPercentage, 100);
  };

  // Check if discount cap has been reached
  const isDiscountCapped = () => {
    if (!selections.shopping) return false;

    const actualShoppingAmount = selections.shopping === 'custom'
      ? selections.customAmount || 0
      : selections.shopping;

    if (actualShoppingAmount === 0) return false;

    let discountPercentage = 0;
    if (selections.isMember === true) discountPercentage = 10;
    if (selections.insurance) {
      discountPercentage = getInsurancePercentage(selections.insurance, selections.healthLevel, selections.customInsuranceAmount);
    }
    if (selections.hasScript === true) discountPercentage += 5;
    if (selections.hasCapitec === true) discountPercentage += 5;
    discountPercentage = Math.min(discountPercentage, 100);

    const uncappedDiscount = Math.round((actualShoppingAmount * discountPercentage) / 100);
    return uncappedDiscount > 3000;
  };

  // Handle custom amount submission
  const handleCustomAmountSubmit = () => {
    const amount = parseInt(customInput);
    if (amount && amount > 0) {
      setSelections({
        ...selections,
        shopping: 'custom',
        customAmount: amount
      });
      setShowCustomModal(false);
      setCustomInput('');
    }
  };

  // Handle shopping option click
  const handleShoppingOptionClick = (value: ShoppingAmount) => {
    if (value === 'custom') {
      setShowCustomModal(true);
    } else {
      setSelections({
        ...selections,
        shopping: selections.shopping === value ? null : value,
        customAmount: null
      });
    }
  };

  // Handle custom insurance amount submission
  const handleCustomInsuranceSubmit = () => {
    const amount = parseInt(customInsuranceInput);
    if (amount && amount > 0) {
      setSelections({
        ...selections,
        insurance: 'custom',
        customInsuranceAmount: amount
      });
      setShowCustomInsuranceModal(false);
      setCustomInsuranceInput('');
    }
  };

  // Handle insurance option click
  const handleInsuranceOptionClick = (value: InsuranceAmount) => {
    if (value === 'custom') {
      setShowCustomInsuranceModal(true);
    } else {
      setSelections({
        ...selections,
        insurance: selections.insurance === value ? null : value,
        customInsuranceAmount: null
      });
    }
  };

  // Reusable discount tile content
  const DiscountTileContent = () => (
    <>
      <h2 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2 text-white">You could be saving</h2>
      <div className="flex items-end gap-4 mb-2 md:mb-3">
        <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-white transition-all duration-500 break-words">
          R{totalDiscount.toLocaleString()}
        </div>
        {getCurrentDiscountPercentage() > 0 && (
          <div className="text-lg font-medium mb-2" style={{ color: '#FFDD00' }}>
            / {getCurrentDiscountPercentage()}%
          </div>
        )}
      </div>
      <div className="text-2xl md:text-3xl font-bold mt-2 md:mt-3 text-white">every month<span className="font-normal">*</span></div>
      <div className="text-sm mt-2 md:mt-4" style={{ color: '#8DCB89' }}>
        That's R{(totalDiscount * 12).toLocaleString()} back in your pocket every year, with cover that protects your loved ones.
      </div>
      {(selections.hasHealthCheck === true || isDiscountCapped()) && (
        <div className="flex flex-wrap gap-2 mt-2 md:mt-4">
          {selections.hasHealthCheck === true && (
            <Badge className="bg-accent text-accent-foreground border-0">
              + Free HealthCheck
            </Badge>
          )}
          {isDiscountCapped() && (
            <Badge
              className="border-0"
              style={{
                backgroundColor: '#FFDD00',
                color: '#111111'
              }}
            >
              Maximum Reached
            </Badge>
          )}
        </div>
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
      const currentIsMobile = window.innerWidth < 768;
      setIsMobile(currentIsMobile);
      const fadeStartPoint = windowHeight * 0.6; // Start fading when tile approaches top
      const fadeEndPoint = windowHeight * 0.75;   // Complete fade as tile reaches top

      // Image fade logic (applies to all screen sizes)
      const imageFadeStart = 100; // Start fading at 100px scroll
      const imageFadeEnd = 400; // Finish fading at 400px scroll

      if (scrollY <= imageFadeStart) {
        // No fading yet
        setImageOpacity(1);
      } else if (scrollY <= imageFadeEnd) {
        // Fade out gradually
        const fadeProgress = (scrollY - imageFadeStart) / (imageFadeEnd - imageFadeStart);
        const opacity = Math.max(0, 1 - fadeProgress);
        setImageOpacity(opacity);
      } else {
        // Fully faded out
        setImageOpacity(0);
      }

      // CTA Button opacity logic
      const ctaFadeStart = windowHeight * 1.8; // Start fading after pharmacy and Capitec options
      const ctaFadeEnd = windowHeight * 2.2; // Fully visible at bottom of content

      if (scrollY <= ctaFadeStart) {
        // Before fade zone - button hidden behind tile, disclaimer at original position
        setCtaButtonOpacity(0);
        setCtaButtonOffset(-80); // Start button behind discount tile
        setDisclaimerOffset(-80); // Start disclaimer higher (where it would be without button space)
      } else if (scrollY >= ctaFadeEnd) {
        // After fade zone - button fully visible, disclaimer below button
        setCtaButtonOpacity(1);
        setCtaButtonOffset(0); // Button in final position
        setDisclaimerOffset(0); // Final position below button
      } else {
        // In fade zone - calculate opacity and offset based on scroll position
        const fadeProgress = (scrollY - ctaFadeStart) / (ctaFadeEnd - ctaFadeStart);
        const opacity = Math.max(0, Math.min(1, fadeProgress));
        const offset = -80 + (fadeProgress * 80); // Move from -80px to 0px
        setCtaButtonOpacity(opacity);
        setCtaButtonOffset(offset);
        setDisclaimerOffset(offset);
      }

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
          setShowFixedTile(fadeProgress > 0); // Show fixed tile immediately when fade starts
        }
      } else {
        // Desktop - reset to default state
        setOriginalTileOpacity(1);
        setShowFixedTile(false);
      }

      // Health boxes sticky behavior and sub-box reveals
      const healthSectionStart = windowHeight * 2.5; // Earlier sticky trigger

      if (scrollY >= healthSectionStart) {
        setHealthBoxesSticky(true);

        // Calculate which sub-boxes should be visible based on scroll only
        const firstBoxReveal = healthSectionStart + 600; // First box appears with much longer delay after sticky
        const subsequentBoxInterval = windowHeight * 0.15; // Much smaller intervals (15% of viewport)

        let boxesToShow = 0;

        if (scrollY >= firstBoxReveal) {
          boxesToShow = 1; // First box is visible

          // Calculate additional boxes based on scroll distance
          const additionalScroll = scrollY - firstBoxReveal;
          const additionalBoxes = Math.floor(additionalScroll / subsequentBoxInterval);
          boxesToShow = Math.min(subBoxes.length, 1 + additionalBoxes);
        }

        setVisibleSubBoxes(boxesToShow);
      } else {
        setHealthBoxesSticky(false);
        setVisibleSubBoxes(0);
      }

      // Fade out fixed discount tile when specific heading reaches it (mobile only)
      if (currentIsMobile && showFixedTile) {
        // Target the specific heading by its text content
        const headings = document.querySelectorAll('h1');
        const targetHeading = Array.from(headings).find(h =>
          h.textContent?.includes('Some rewards really are better')
        );

        if (targetHeading) {
          const headingRect = targetHeading.getBoundingClientRect();
          const fixedTileBottom = 200; // Fixed tile bottom position
          const fadeZone = 150; // Pixels over which to fade

          if (headingRect.top <= fixedTileBottom && headingRect.top > fixedTileBottom - fadeZone) {
            // In fade zone - calculate opacity based on position
            const fadeProgress = (fixedTileBottom - headingRect.top) / fadeZone;
            const opacity = Math.max(0, 1 - fadeProgress);
            setFixedTileOpacity(opacity);
          } else if (headingRect.top <= fixedTileBottom - fadeZone) {
            // Fully faded - hide the tile
            setFixedTileOpacity(0);
            setShowFixedTile(false);
          } else {
            // Above fade zone - keep tile visible
            setFixedTileOpacity(1);
          }
        }
      }
    };

    // Set up scroll-based fade effect for sub-boxes and main-boxes (more responsive)
    const updateSubBoxFades = () => {
      if (!healthBoxesSticky) return;

      // Get the actual position and height of the sticky main-boxes
      const stickyContainer = document.querySelector('.md\\:grid.md\\:grid-cols-2');
      const stickyRect = stickyContainer?.getBoundingClientRect();
      const stickyBottom = stickyRect ? stickyRect.bottom : 420;
      const mainBoxHeight = stickyRect ? stickyRect.height : 100;
      const fadeZone = mainBoxHeight;

      let allSubBoxesFaded = true;

      // Update all sub-boxes on every scroll
      document.querySelectorAll('[data-subbox-id]').forEach(el => {
        const subBoxId = el.getAttribute('data-subbox-id') || '0';
        const rect = el.getBoundingClientRect();

        if (rect.top < stickyBottom && rect.top > stickyBottom - fadeZone) {
          // In fade zone - calculate opacity based on position
          const fadeProgress = (stickyBottom - rect.top) / fadeZone;
          const opacity = Math.max(0, 1 - fadeProgress);
          setSubBoxFadeOpacity(prev => ({ ...prev, [subBoxId]: opacity }));
          if (opacity > 0) allSubBoxesFaded = false;
        } else if (rect.top >= stickyBottom) {
          // Below sticky area - full opacity
          setSubBoxFadeOpacity(prev => ({ ...prev, [subBoxId]: 1 }));
          allSubBoxesFaded = false;
        } else {
          // Above sticky area - minimum opacity
          setSubBoxFadeOpacity(prev => ({ ...prev, [subBoxId]: 0 }));
        }
      });

      // Fade out main-boxes after all sub-boxes are faded
      if (allSubBoxesFaded && stickyContainer) {
        const lastSubBox = document.querySelector('[data-subbox-id]:last-of-type');
        if (lastSubBox) {
          const lastSubBoxRect = lastSubBox.getBoundingClientRect();
          const mainBoxFadeStart = stickyBottom + mainBoxHeight;
          const mainBoxFadeZone = mainBoxHeight;

          if (lastSubBoxRect.top < mainBoxFadeStart && lastSubBoxRect.top > mainBoxFadeStart - mainBoxFadeZone) {
            // Fade main-boxes based on last sub-box position
            const fadeProgress = (mainBoxFadeStart - lastSubBoxRect.top) / mainBoxFadeZone;
            const opacity = Math.max(0, 1 - fadeProgress);
            stickyContainer.style.opacity = opacity.toString();
          } else if (lastSubBoxRect.top <= mainBoxFadeStart - mainBoxFadeZone) {
            // Fully fade out main-boxes
            stickyContainer.style.opacity = '0';
          } else {
            // Keep main-boxes visible
            stickyContainer.style.opacity = '1';
          }
        }
      } else if (stickyContainer) {
        // Keep main-boxes visible when sub-boxes are still visible
        stickyContainer.style.opacity = '1';
      }
    };

    const handleScrollWithFade = () => {
      handleScroll();

      // Update sub-box fades on every scroll for maximum responsiveness
      updateSubBoxFades();
    };

    window.addEventListener('scroll', handleScrollWithFade);
    return () => {
      window.removeEventListener('scroll', handleScrollWithFade);
    };
  }, [healthBoxesSticky]);

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
        <div
          className="fixed top-4 left-4 right-4 z-50 lg:hidden animate-in fade-in duration-300 transition-opacity duration-500"
          style={{ opacity: fixedTileOpacity }}
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
              className="relative rounded-2xl p-6 shadow-elegant border-2 z-20"
              style={{
                background: 'linear-gradient(135deg, #006B3A 0%, #04411F 100%)',
                borderColor: '#8DCB89'
              }}
            >
              <DiscountTileContent />
            </div>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center">
              {/* Left side - Text content */}
              <div className="text-left">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent pb-2" style={{ lineHeight: '1.25' }}>
                  Your rewards just<br className="hidden sm:block" /> got better!
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Let's help you save more everyday.
                </p>
              </div>

              {/* Right side - BetterRewards card */}
              <div className="flex justify-center lg:justify-end">
                <img
                  src="/better-rewards-card.png"
                  alt="Dis-Chem Better Rewards"
                  className="w-auto object-contain transition-all duration-300 ease-out"
                  style={{
                    height: '21rem',
                    opacity: imageOpacity
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Sticky Discount */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_400px] gap-12 items-start">
            {/* Configuration Options */}
            <div className="space-y-16 order-2 lg:order-1">
              {/* Shopping Amount */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">How much do you spend<br className="hidden sm:block" /> at Dis-Chem?</h2>
                  <p className="text-muted-foreground">Select your typical monthly spend</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {shoppingOptions.map((option) => (
                    <Card
                      key={option.value}
                      className={`relative p-6 cursor-pointer transition-all duration-300 hover:shadow-hover hover:-translate-y-1 ${option.value === 'custom' ? 'col-span-2' : ''
                        } ${selections.shopping === option.value
                          ? "border-primary bg-accent shadow-hover"
                          : "border-border hover:border-primary/50"
                        }`}
                      onClick={() => handleShoppingOptionClick(option.value)}
                    >
                      {selections.shopping === option.value && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                      <div className="text-2xl font-bold text-foreground">
                        {option.value === 'custom' && selections.customAmount
                          ? `R${selections.customAmount.toLocaleString()}`
                          : option.label}
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Custom Amount Modal */}
                <Dialog open={showCustomModal} onOpenChange={setShowCustomModal}>
                  <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-lg h-auto max-h-[calc(100vh-4rem)] sm:max-h-[85vh] bg-white rounded-2xl p-6 flex flex-col justify-center">
                    <DialogHeader className="space-y-6 pr-12">
                      <DialogTitle className="text-2xl md:text-3xl font-bold mb-2">
                        How much do you spend<br className="hidden sm:block" /> at Dis-Chem?
                      </DialogTitle>
                      <div className="h-16"></div>
                      <h3 className="text-lg font-semibold">Add your own amount</h3>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="relative mb-4">
                        <span className="absolute left-3 top-3 pr-2 text-5xl md:text-6xl font-bold text-[#00953B]">R</span>
                        <Input
                          type="number"
                          placeholder="0"
                          value={customInput}
                          onChange={(e) => setCustomInput(e.target.value)}
                          className="pl-14 pb-4 pt-2 text-5xl md:text-6xl font-bold text-[#00953B] border-0 border-b-2 border-b-gray-300 focus:border-b-[#8DCB89] focus:ring-0 focus:ring-offset-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 bg-transparent rounded-none h-auto min-h-[4rem] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                          min="1"
                          style={{ boxShadow: 'none' }}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowCustomModal(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleCustomAmountSubmit}
                          className="flex-1"
                          disabled={!customInput || parseInt(customInput) <= 0}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Divider */}
              <div className="border-t border-border"></div>

              {/* BetterRewards Member */}
              <div className="space-y-4">
                <div className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent pb-2" style={{ lineHeight: '1.25' }}>
                  Enjoy 10% just<br className="hidden sm:block" /> for being part of Better Rewards
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
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">How much does your life and funeral cover cost you every month?</h2>
                  <p className="text-muted-foreground">Your combined monthly premium</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {insuranceOptions.map((option) => (
                    <Card
                      key={option.value}
                      className={`relative p-6 cursor-pointer transition-all duration-300 hover:shadow-hover hover:-translate-y-1 ${option.value === 'custom' ? 'col-span-2' : ''
                        } ${selections.insurance === option.value
                          ? "border-primary bg-accent shadow-hover"
                          : "border-border hover:border-primary/50"
                        }`}
                      onClick={() => handleInsuranceOptionClick(option.value)}
                    >
                      {selections.insurance === option.value && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                      <div className="text-2xl font-bold text-foreground mb-1">
                        {option.value === 'custom' && selections.customInsuranceAmount
                          ? `R${selections.customInsuranceAmount.toLocaleString()}`
                          : option.label}
                      </div>
                      {option.value !== 'custom' && (
                        <div className="text-sm text-primary font-medium">
                          {getInsurancePercentage(option.value, selections.healthLevel)}% back
                        </div>
                      )}
                      {option.value === 'custom' && selections.customInsuranceAmount && (
                        <div className="text-sm text-primary font-medium">
                          {getInsurancePercentage(option.value, selections.healthLevel, selections.customInsuranceAmount)}% back
                        </div>
                      )}
                    </Card>
                  ))}
                </div>

                {/* Custom Insurance Amount Modal */}
                <Dialog open={showCustomInsuranceModal} onOpenChange={setShowCustomInsuranceModal}>
                  <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-lg h-auto max-h-[calc(100vh-4rem)] sm:max-h-[85vh] bg-white rounded-2xl p-6 flex flex-col justify-center">
                    <DialogHeader className="space-y-6 pr-12">
                      <DialogTitle className="text-2xl md:text-3xl font-bold mb-2">
                        How much does your life and funeral cover cost you every month?
                      </DialogTitle>
                      <div className="h-16"></div>
                      <h3 className="text-lg font-semibold">Add your own amount</h3>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="relative mb-4">
                        <span className="absolute left-3 top-3 pr-2 text-5xl md:text-6xl font-bold text-[#00953B]">R</span>
                        <Input
                          type="number"
                          placeholder="0"
                          value={customInsuranceInput}
                          onChange={(e) => setCustomInsuranceInput(e.target.value)}
                          className="pl-14 pb-4 pt-2 text-5xl md:text-6xl font-bold text-[#00953B] border-0 border-b-2 border-b-gray-300 focus:border-b-[#8DCB89] focus:ring-0 focus:ring-offset-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 bg-transparent rounded-none h-auto min-h-[4rem] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                          min="1"
                          style={{ boxShadow: 'none' }}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowCustomInsuranceModal(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleCustomInsuranceSubmit}
                          className="flex-1"
                          disabled={!customInsuranceInput || parseInt(customInsuranceInput) <= 0}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
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
                  <div className="text-2xl font-bold text-foreground mb-2">Do you pay<br className="hidden sm:block" /> with a Capitec account?</div>
                  <div className="text-sm text-primary font-medium">+5% boost</div>
                </Card>
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

              {/* Better Cover and Rewards Copy */}
              <div className={`space-y-4 transition-all duration-300 ${healthBoxesSticky && !isMobile ? 'sticky top-8 z-40' : ''}`}>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent pb-2" style={{ lineHeight: '1.25' }}>
                    Some rewards really are better. Let's compare.
                  </h1>
                </div>
              </div>

              {/* Health Options Section */}
              <div className="space-y-8 mt-16">
                {/* Mobile: Stacked Layout */}
                <div className="block md:hidden space-y-6">
                  {/* BetterRewards */}
                  <div className="border-2 border-border rounded-2xl p-8 bg-transparent">
                    <h2 className="text-2xl font-bold text-foreground text-center">Dis-Chem BetterRewards</h2>
                  </div>

                  {/* BetterRewards Sub-box (Mobile Only) */}
                  <div className="px-8">
                    <div
                      data-subbox-id="left-1"
                      className="relative transition-all duration-300 ease-out"
                      style={{ opacity: 1 }}
                    >
                      <Card className="relative p-8 cursor-pointer transition-all duration-300 hover:shadow-hover hover:-translate-y-1 border-border hover:border-primary/50 bg-white z-10">
                        <div className="text-lg font-semibold text-foreground">
                          One HealthCheck unlocks a year's worth of savings.
                        </div>
                      </Card>
                    </div>
                  </div>

                  {/* Chasing Top Status Header */}
                  <div className="border-2 border-border rounded-2xl p-8 bg-transparent">
                    <h2 className="text-2xl font-bold text-foreground text-center">Chasing Top Status</h2>
                  </div>
                </div>

                {/* Desktop: Sticky Headers */}
                <div className={`hidden md:grid md:grid-cols-2 gap-6 items-start transition-all duration-300 ${healthBoxesSticky ? 'sticky top-80 z-30' : ''}`}>
                  {/* BetterRewards */}
                  <div className={`border-2 border-border rounded-2xl p-8 transition-colors duration-300 ${healthBoxesSticky ? 'bg-[#f3f3f3]/80' : 'bg-transparent'}`}>
                    <h2 className="text-2xl font-bold text-foreground text-center">Dis-Chem BetterRewards</h2>
                  </div>

                  {/* Chasing Top Status Header */}
                  <div className={`border-2 border-border rounded-2xl p-8 transition-colors duration-300 ${healthBoxesSticky ? 'bg-[#f3f3f3]/80' : 'bg-transparent'}`}>
                    <h2 className="text-2xl font-bold text-foreground text-center">Chasing Top Status</h2>
                  </div>
                </div>

                {/* Sub-boxes Container */}
                <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-2 md:gap-6 md:items-start">
                  {/* Left sub-box (Desktop Only) */}
                  <div className="hidden md:flex flex-col justify-between h-full">
                    <div
                      data-subbox-id="left-1"
                      className={`relative transition-all duration-300 ease-out ${visibleSubBoxes > 0 ? 'opacity-100' : 'opacity-0'}`}
                      style={{
                        transitionDelay: '0ms',
                        opacity: healthBoxesSticky && subBoxFadeOpacity['left-1'] !== undefined
                          ? subBoxFadeOpacity['left-1']
                          : visibleSubBoxes > 0 ? 1 : 0
                      }}
                    >
                      <Card className="relative p-8 cursor-pointer transition-all duration-300 hover:shadow-hover hover:-translate-y-1 border-border hover:border-primary/50 bg-white z-10">
                        <div className="text-lg font-semibold text-foreground">
                          One HealthCheck unlocks a year's worth of savings.
                        </div>
                      </Card>
                    </div>
                  </div>

                  {/* Sub-boxes on the right */}
                  <div className="space-y-8 px-8 md:px-0">
                    {subBoxes.map((subBox, index) => (
                      <div
                        key={subBox.id}
                        data-subbox-id={subBox.id}
                        className={`relative transition-all duration-300 ease-out ${!isMobile && index < visibleSubBoxes
                          ? 'opacity-100'
                          : !isMobile ? 'opacity-0' : ''
                          }`}
                        style={{
                          transitionDelay: `${index * 75}ms`,
                          opacity: isMobile ? 1 : (
                            healthBoxesSticky && subBoxFadeOpacity[subBox.id] !== undefined
                              ? subBoxFadeOpacity[subBox.id]
                              : index < visibleSubBoxes ? 1 : 0
                          )
                        }}
                      >
                        {/* Main Sub-box */}
                        <Card
                          className="relative p-8 cursor-pointer transition-all duration-300 hover:shadow-hover hover:-translate-y-1 border-border hover:border-primary/50 bg-white z-10"
                          onClick={() => {
                            setSelectedSubBox(subBox.id);
                            setShowSubBoxModal(true);
                          }}
                        >
                          <div className="text-lg font-semibold text-foreground">
                            {subBox.title}
                          </div>
                        </Card>


                      </div>
                    ))}


                  </div>
                </div>

                {/* Full-width divider */}
                <div className="border-t border-border mt-18 mb-12"></div>

                {/* Final centered heading */}
                <div
                  className={`transition-opacity duration-700 ease-out mb-72 ${visibleSubBoxes >= subBoxes.length ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    transitionDelay: `${subBoxes.length * 75 + 300}ms`
                  }}
                >
                  <h1 className="text-5xl md:text-6xl font-bold mb-6 pb-2" style={{ lineHeight: '1.25' }}>
                    <span
                      className="bg-clip-text text-transparent"
                      style={{
                        backgroundImage: 'linear-gradient(135deg, #04411F 0%, #006B3A 100%)'
                      }}
                    >
                      One gives you better rewards.
                    </span>
                    <br />
                    <span className="bg-gradient-primary bg-clip-text text-transparent">
                      The other gives you steps to count, and maybe a smoothie.
                    </span>
                  </h1>
                </div>
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
                  className="relative rounded-2xl p-8 lg:p-12 shadow-elegant border-2 z-20"
                  style={{
                    background: 'linear-gradient(135deg, #006B3A 0%, #04411F 100%)',
                    borderColor: '#8DCB89'
                  }}
                >
                  <DiscountTileContent />
                </div>
              </div>

              {/* Call-to-Action Button */}
              <div
                className="mt-6 relative z-10 transition-all duration-700 ease-out"
                style={{
                  opacity: ctaButtonOpacity,
                  transform: `translateY(${ctaButtonOffset}px)`
                }}
              >
                <Button
                  asChild
                  className="w-full text-lg font-semibold py-8 px-8 rounded-2xl flex items-center justify-between transition-all duration-300 hover:shadow-hover hover:-translate-y-1 border-2 border-transparent hover:border-[#FAC736]"
                  style={{
                    backgroundColor: '#FFDD00',
                    color: '#111111'
                  }}
                >
                  <a href="https://dischemlife.co.za/product-selector/" target="_blank" rel="noopener noreferrer">
                    <span>Start saving</span>
                    <ChevronRight className="w-5 h-5" />
                  </a>
                </Button>
              </div>

              {/* Disclaimer */}
              <div
                className="mt-4 text-xs leading-relaxed font-thin transition-all duration-700 ease-out relative z-0"
                style={{
                  color: '#A5A5A5',
                  transform: `translateY(${disclaimerOffset}px)`
                }}
              >
                Dis-Chem Life is an authorised FSP, No 50594. Products are underwritten by Guardrisk Life Limited, a licensed life insurer (FSP No 76). T&Cs apply. For full policy T&Cs & more info, visit www.dischemlife.co.za.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Health Option Modal */}
      <Dialog open={showHealthModal} onOpenChange={setShowHealthModal}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-lg h-auto max-h-[calc(100vh-4rem)] sm:max-h-[85vh] bg-white rounded-2xl p-6 flex flex-col justify-center">
          <DialogHeader className="space-y-6 pr-12">
            <DialogTitle className="text-2xl md:text-3xl font-bold mb-2">
              HealthCheck
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-lg text-foreground">
              One quick visit. One clear result. Better Rewards.
            </p>
            <p className="text-base text-muted-foreground">
              Walk into any Dis-Chem clinic, get your blood pressure, glucose, cholesterol, BMI, and non-smoker check, all in one go. Thirty minutes, tops. Then go live your life (with cover and savings to match).
            </p>
            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowHealthModal(false)}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sub-box Modal */}
      <Dialog open={showSubBoxModal} onOpenChange={setShowSubBoxModal}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-lg h-auto max-h-[calc(100vh-4rem)] sm:max-h-[85vh] bg-white rounded-2xl p-6 flex flex-col justify-center">
          {selectedSubBox && (
            <>
              <DialogHeader className="space-y-6 pr-12">
                <DialogTitle className="text-2xl md:text-3xl font-bold mb-2">
                  {subBoxes.find(box => box.id === selectedSubBox)?.modalTitle}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-base text-muted-foreground">
                  {subBoxes.find(box => box.id === selectedSubBox)?.modalDescription}
                </p>
                <div className="flex gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowSubBoxModal(false)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
