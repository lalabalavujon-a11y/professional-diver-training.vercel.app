import { useState, useEffect } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TrialCountdownProps {
  expiresAt: string;
  onUpgrade?: () => void;
  showUpgradeButton?: boolean;
}

export default function TrialCountdown({ expiresAt, onUpgrade, showUpgradeButton = true }: TrialCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
  }>({ hours: 0, minutes: 0, seconds: 0, total: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiration = new Date(expiresAt).getTime();
      const difference = expiration - now;

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ hours, minutes, seconds, total: difference });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, total: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  const isExpired = timeLeft.total <= 0;
  const isLowTime = timeLeft.total <= 3600000; // 1 hour remaining

  if (isExpired) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <div className="flex items-center justify-between">
            <span className="font-medium">Your free trial has expired</span>
            {showUpgradeButton && (
              <Button 
                size="sm" 
                className="bg-red-600 hover:bg-red-700 text-white ml-4"
                onClick={onUpgrade}
                data-testid="button-upgrade-expired"
              >
                Upgrade Now
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className={`${isLowTime ? 'border-orange-200 bg-orange-50' : 'border-blue-200 bg-blue-50'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isLowTime ? 'bg-orange-100' : 'bg-blue-100'
            }`}>
              <Clock className={`w-5 h-5 ${isLowTime ? 'text-orange-600' : 'text-blue-600'}`} />
            </div>
            <div>
              <div className="font-semibold text-slate-900">Free Trial</div>
              <div className={`text-sm ${isLowTime ? 'text-orange-600' : 'text-blue-600'}`}>
                <span className="font-mono text-lg">
                  {timeLeft.hours.toString().padStart(2, '0')}:
                  {timeLeft.minutes.toString().padStart(2, '0')}:
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </span>
                <span className="ml-2">remaining</span>
              </div>
            </div>
          </div>
          
          {showUpgradeButton && (
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
                onClick={() => window.open('https://buy.stripe.com/8x24gzg9S2gG7WX4XugMw03', '_blank')}
                data-testid="button-upgrade-monthly"
              >
                $25/month
              </Button>
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => window.open('https://buy.stripe.com/eVq8wP1eY2gG4KLblSgMw04', '_blank')}
                data-testid="button-upgrade-yearly"
              >
                $250/year
              </Button>
            </div>
          )}
        </div>
        
        {isLowTime && (
          <div className="mt-3 text-sm text-orange-700">
            <strong>Hurry!</strong> Your trial expires soon. Upgrade now to continue your diving education.
          </div>
        )}
      </CardContent>
    </Card>
  );
}