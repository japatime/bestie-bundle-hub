
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "react-router-dom";
import MobileNav from "@/components/layout/MobileNav";
import AirtimePurchaseForm from "@/components/airtime/AirtimePurchaseForm";
import RecentAirtimeTransactions from "@/components/airtime/RecentAirtimeTransactions";

const Airtime = () => {
  const location = useLocation();
  
  return (
    <>
      <MobileNav activePath={location.pathname} />
      <MainLayout>
        <div className="pt-16 md:pt-0">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Buy Airtime</h2>
            <p className="text-muted-foreground">
              Purchase airtime for any Nigerian network
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Purchase Airtime</CardTitle>
                <CardDescription>
                  Buy airtime for any phone number
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AirtimePurchaseForm />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Your recent airtime purchases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentAirtimeTransactions />
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default Airtime;
