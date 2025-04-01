
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "react-router-dom";
import MobileNav from "@/components/layout/MobileNav";
import DataPurchaseForm from "@/components/data/DataPurchaseForm";

const Data = () => {
  const location = useLocation();
  
  return (
    <>
      <MobileNav activePath={location.pathname} />
      <MainLayout>
        <div className="pt-16 md:pt-0">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Buy Data</h2>
            <p className="text-muted-foreground">
              Purchase data bundles for any Nigerian network
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Purchase Data</CardTitle>
                <CardDescription>
                  Buy data for any phone number
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataPurchaseForm />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Your recent data purchases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  No recent transactions found
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default Data;
