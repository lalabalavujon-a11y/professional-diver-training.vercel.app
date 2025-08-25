import { nanoid } from "nanoid";

// Affiliate service for managing partner/referral program
export class AffiliateService {
  private affiliates: Map<string, any> = new Map();
  private referrals: Map<string, any> = new Map();
  private clicks: Map<string, any> = new Map();

  // Create affiliate account
  async createAffiliate(userData: { userId: string; name: string; email: string }) {
    const affiliateCode = this.generateAffiliateCode();
    const referralLink = `https://professional-diver.diverwell.app/?ref=${affiliateCode}`;
    
    const affiliate = {
      id: nanoid(),
      userId: userData.userId,
      name: userData.name,
      email: userData.email,
      affiliateCode,
      commissionRate: 50, // 50% commission
      totalReferrals: 0,
      totalEarnings: 0,
      monthlyEarnings: 0,
      referralLink,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.affiliates.set(affiliate.id, affiliate);
    return affiliate;
  }

  // Generate unique affiliate code
  private generateAffiliateCode(): string {
    return `PD${nanoid(8).toUpperCase()}`;
  }

  // Track affiliate click
  async trackClick(affiliateCode: string, clickData: {
    ipAddress?: string;
    userAgent?: string;
    referrerUrl?: string;
    landingPage?: string;
  }) {
    const click = {
      id: nanoid(),
      affiliateCode,
      ...clickData,
      converted: false,
      createdAt: new Date(),
    };

    this.clicks.set(click.id, click);
    return click;
  }

  // Process referral conversion
  async processReferral(data: {
    affiliateCode: string;
    referredUserId: string;
    subscriptionType: string;
    monthlyValue: number; // in cents
  }) {
    const affiliate = Array.from(this.affiliates.values())
      .find(a => a.affiliateCode === data.affiliateCode);

    if (!affiliate) {
      throw new Error('Affiliate not found');
    }

    const commissionEarned = Math.round(data.monthlyValue * (affiliate.commissionRate / 100));

    const referral = {
      id: nanoid(),
      affiliateId: affiliate.id,
      referredUserId: data.referredUserId,
      affiliateCode: data.affiliateCode,
      subscriptionType: data.subscriptionType,
      monthlyValue: data.monthlyValue,
      commissionEarned,
      status: 'ACTIVE',
      firstPaymentDate: new Date(),
      lastPaymentDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Update affiliate stats
    affiliate.totalReferrals += 1;
    affiliate.totalEarnings += commissionEarned;
    affiliate.monthlyEarnings += commissionEarned;
    affiliate.updatedAt = new Date();

    this.referrals.set(referral.id, referral);
    this.affiliates.set(affiliate.id, affiliate);

    // Mark corresponding click as converted
    const relatedClick = Array.from(this.clicks.values())
      .find(c => c.affiliateCode === data.affiliateCode && !c.converted);
    
    if (relatedClick) {
      relatedClick.converted = true;
      relatedClick.convertedUserId = data.referredUserId;
      this.clicks.set(relatedClick.id, relatedClick);
    }

    return referral;
  }

  // Get affiliate dashboard data
  async getAffiliateDashboard(affiliateId: string) {
    const affiliate = this.affiliates.get(affiliateId);
    if (!affiliate) {
      throw new Error('Affiliate not found');
    }

    const referrals = Array.from(this.referrals.values())
      .filter(r => r.affiliateId === affiliateId);

    const clicks = Array.from(this.clicks.values())
      .filter(c => c.affiliateCode === affiliate.affiliateCode);

    const totalClicks = clicks.length;
    const totalConversions = clicks.filter(c => c.converted).length;
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

    const monthlyReferrals = referrals.filter(r => {
      const referralDate = new Date(r.createdAt);
      const now = new Date();
      return referralDate.getMonth() === now.getMonth() && 
             referralDate.getFullYear() === now.getFullYear();
    });

    return {
      affiliate,
      stats: {
        totalReferrals: affiliate.totalReferrals,
        totalEarnings: affiliate.totalEarnings,
        monthlyEarnings: affiliate.monthlyEarnings,
        monthlyReferrals: monthlyReferrals.length,
        totalClicks,
        totalConversions,
        conversionRate: Math.round(conversionRate * 100) / 100,
        averageOrderValue: referrals.length > 0 
          ? Math.round(referrals.reduce((sum, r) => sum + r.monthlyValue, 0) / referrals.length)
          : 0
      },
      recentReferrals: referrals
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10),
      recentClicks: clicks
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 20)
    };
  }

  // Get affiliate leaderboard
  async getLeaderboard() {
    const affiliatesList = Array.from(this.affiliates.values())
      .filter(a => a.isActive)
      .sort((a, b) => b.monthlyEarnings - a.monthlyEarnings)
      .slice(0, 20);

    return affiliatesList.map((affiliate, index) => ({
      rank: index + 1,
      name: affiliate.name,
      totalReferrals: affiliate.totalReferrals,
      monthlyEarnings: affiliate.monthlyEarnings,
      totalEarnings: affiliate.totalEarnings,
      affiliateCode: affiliate.affiliateCode,
      joinDate: affiliate.createdAt,
    }));
  }

  // Calculate monthly commissions for all affiliates
  async calculateMonthlyCommissions() {
    const affiliatesList = Array.from(this.affiliates.values())
      .filter(a => a.isActive);

    const commissions = affiliatesList.map(affiliate => {
      const monthlyReferrals = Array.from(this.referrals.values())
        .filter(r => {
          if (r.affiliateId !== affiliate.id) return false;
          
          const referralDate = new Date(r.createdAt);
          const now = new Date();
          return referralDate.getMonth() === now.getMonth() && 
                 referralDate.getFullYear() === now.getFullYear();
        });

      const monthlyCommission = monthlyReferrals
        .reduce((sum, r) => sum + r.commissionEarned, 0);

      return {
        affiliateId: affiliate.id,
        affiliateCode: affiliate.affiliateCode,
        name: affiliate.name,
        email: affiliate.email,
        monthlyCommission,
        referralCount: monthlyReferrals.length,
        paymentStatus: 'PENDING'
      };
    });

    return commissions.filter(c => c.monthlyCommission > 0);
  }

  // Get all affiliates
  async getAllAffiliates() {
    return Array.from(this.affiliates.values());
  }

  // Get affiliate by code
  async getAffiliateByCode(code: string) {
    return Array.from(this.affiliates.values())
      .find(a => a.affiliateCode === code);
  }

  // Add predefined super admins and lifetime users
  async initializeSpecialUsers() {
    // Super Admins
    const superAdmins = [
      { email: 'lalabalavu.jon@gmail.com', name: 'Jon Lalabalavu' },
      { email: 'sephdee@hotmail.com', name: 'Jon Lalabalavu' }
    ];

    // Lifetime Access Users
    const lifetimeUsers = [
      { email: 'freddierusseljoseph@yahoo.com', name: 'Freddie Russell Joseph' },
      { email: 'deesuks@gmail.com', name: 'Dilo Suka' },
      { email: 'steve44hall@yahoo.co.uk', name: 'Steve Hall' },
      { email: 'mike@ascotwood.com', name: 'Mike Scarpellini' },
      // Eroni Cirikidaveta - email to follow
    ];

    const specialUsers = {
      superAdmins,
      lifetimeUsers,
      initialized: true,
      createdAt: new Date(),
    };

    return specialUsers;
  }
}

export const affiliateService = new AffiliateService();

// Initialize demo data
(async () => {
  // Create demo affiliate for testing
  const demoAffiliate = await affiliateService.createAffiliate({
    userId: 'demo-affiliate-1',
    name: 'Demo Partner',
    email: 'partner@example.com'
  });

  // Add some sample referrals for demo
  await affiliateService.processReferral({
    affiliateCode: demoAffiliate.affiliateCode,
    referredUserId: 'user-1',
    subscriptionType: 'MONTHLY',
    monthlyValue: 2500 // $25.00
  });

  await affiliateService.processReferral({
    affiliateCode: demoAffiliate.affiliateCode,
    referredUserId: 'user-2', 
    subscriptionType: 'ANNUAL',
    monthlyValue: 25000 // $250.00
  });

  // Track some demo clicks
  await affiliateService.trackClick(demoAffiliate.affiliateCode, {
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0...',
    landingPage: '/',
    referrerUrl: 'https://google.com'
  });

  await affiliateService.trackClick(demoAffiliate.affiliateCode, {
    ipAddress: '192.168.1.2',
    userAgent: 'Mozilla/5.0...',
    landingPage: '/trial-signup',
    referrerUrl: 'https://facebook.com'
  });

  // Initialize special users
  await affiliateService.initializeSpecialUsers();
})();