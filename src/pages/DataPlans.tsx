
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import MobileNav from "@/components/layout/MobileNav";
import { useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getDataPlans } from "@/lib/services";
import { useToast } from "@/hooks/use-toast";
import { Loader, Package2, Wifi, Clock, Wallet, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DataPlan {
  network_operator: string;
  plan_summary: string;
  package_code: string;
  plan_id: number;
  validity: string;
  regular_price: number;
  agent_price: number;
  dealer_price: number;
  currency: string;
}

const DataPlans = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [network, setNetwork] = useState("mtn");
  const [searchTerm, setSearchTerm] = useState("");

  // Query data plans
  const { data, isLoading, error } = useQuery({
    queryKey: ["dataPlans"],
    queryFn: () => getDataPlans(),
  });

  // Filter plans by network and search term
  const filteredPlans = React.useMemo(() => {
    if (!data?.data) return [];
    
    let plans = data.data.filter((plan: DataPlan) => 
      plan.network_operator === network
    );
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      plans = plans.filter((plan: DataPlan) => 
        plan.plan_summary.toLowerCase().includes(term) || 
        plan.validity.toLowerCase().includes(term) ||
        plan.package_code.toLowerCase().includes(term) ||
        plan.regular_price.toString().includes(term)
      );
    }
    
    return plans;
  }, [data, network, searchTerm]);

  // Networks that we support
  const networks = [
    { id: "mtn", name: "MTN", color: "bg-yellow-400" },
    { id: "airtel", name: "Airtel", color: "bg-red-500" },
    { id: "glo", name: "Glo", color: "bg-green-500" },
    { id: "9mobile", name: "9mobile", color: "bg-green-300" },
  ];

  return (
    <>
      <MobileNav activePath={location.pathname} />
      <MainLayout>
        <div className="pt-16 md:pt-0">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Data Plans</h2>
            <p className="text-muted-foreground">Browse available data plans by network</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select Network</CardTitle>
              <CardDescription>
                Choose a network to view available data plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="mtn" onValueChange={setNetwork} className="w-full">
                <TabsList className="grid grid-cols-4 w-full mb-6">
                  {networks.map(network => (
                    <TabsTrigger key={network.id} value={network.id} className="flex items-center justify-center">
                      <div className={`h-4 w-4 rounded-full ${network.color} mr-2`}></div>
                      <span>{network.name}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
                <div className="my-4">
                  <Label htmlFor="search">Search Plans</Label>
                  <Input
                    id="search"
                    placeholder="Search by name, price, validity..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </Tabs>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader className="animate-spin h-8 w-8 text-primary" />
            </div>
          ) : error ? (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Error</CardTitle>
                <CardDescription>Failed to fetch data plans</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Please try again later or contact support.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPlans.map((plan: DataPlan) => (
                  <Card key={plan.plan_id} className="flex flex-col h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{plan.plan_summary}</CardTitle>
                        <Badge variant="outline" className="ml-2">
                          {plan.network_operator.toUpperCase()}
                        </Badge>
                      </div>
                      <CardDescription>{plan.package_code}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between border-b pb-2">
                          <div className="flex items-center">
                            <Wallet className="h-4 w-4 mr-2 opacity-70" />
                            <span className="text-sm">Price:</span>
                          </div>
                          <span className="font-medium">₦{plan.regular_price.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between border-b pb-2">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 opacity-70" />
                            <span className="text-sm">Validity:</span>
                          </div>
                          <span className="font-medium">{plan.validity}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 mr-2 opacity-70" />
                            <span className="text-sm">Plan ID:</span>
                          </div>
                          <span className="font-medium text-sm">{plan.plan_id}</span>
                        </div>
                      </div>
                    </CardContent>
                    <div className="p-4 pt-0 mt-auto">
                      <Button 
                        variant="default" 
                        className="w-full"
                        onClick={() => {
                          toast({
                            title: "Selected Data Plan",
                            description: `${plan.plan_summary} - ₦${plan.regular_price}`
                          });
                        }}
                      >
                        <Wifi className="mr-2 h-4 w-4" />
                        Select Plan
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {filteredPlans.length === 0 && (
                <Card className="border-dashed">
                  <CardHeader>
                    <CardTitle>No Plans Found</CardTitle>
                    <CardDescription>
                      No data plans match your search criteria
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <Package2 className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-center text-muted-foreground">
                      Try adjusting your search or select a different network provider
                    </p>
                    {searchTerm && (
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setSearchTerm("")}
                      >
                        Clear Search
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </MainLayout>
    </>
  );
};

export default DataPlans;
