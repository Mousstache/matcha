import { Card, CardContent, CardTitle, } from "@/components/ui/card";
// import { useState } from "react";

const Home = () => {
  return (
    <div className="flex items-center justify-center min-h-screen text-3xl font-bold">
      <Card>
        <CardTitle>
          <h2>Listes des matchs :</h2>
        </CardTitle>

        <CardContent>
        </CardContent>

        <CardTitle>
          <h2>Listes des Like :</h2>
        </CardTitle>

        <CardContent>
        </CardContent>

        <CardTitle>
          <h2>Listes des gens qui likent :</h2>
        </CardTitle>

        <CardContent>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;