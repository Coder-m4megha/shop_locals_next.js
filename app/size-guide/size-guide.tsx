import Image from "next/image"
import Link from "next/link"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SizeGuide() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-serif mb-4">Size Guide</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find your perfect fit with our comprehensive size guide. If you need assistance, our customer service team is
          always ready to help.
        </p>
      </div>

      <Tabs defaultValue="blouses" className="mb-12">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
          <TabsTrigger
            value="blouses"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
          >
            Blouses
          </TabsTrigger>
          <TabsTrigger
            value="sarees"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
          >
            Sarees
          </TabsTrigger>
        </TabsList>

        <TabsContent value="blouses" className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-2xl font-serif mb-4">How to Measure</h2>
              <p className="mb-6">
                To ensure the perfect fit for your blouse, please follow these measurement guidelines:
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Bust</h3>
                  <p className="text-sm text-muted-foreground">
                    Measure around the fullest part of your bust, keeping the measuring tape parallel to the floor.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Waist</h3>
                  <p className="text-sm text-muted-foreground">
                    Measure around your natural waistline, which is the narrowest part of your torso.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Hip</h3>
                  <p className="text-sm text-muted-foreground">
                    Measure around the fullest part of your hips, keeping the measuring tape parallel to the floor.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Shoulder</h3>
                  <p className="text-sm text-muted-foreground">
                    Measure from the edge of one shoulder to the other, across your back.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Sleeve Length</h3>
                  <p className="text-sm text-muted-foreground">
                    Measure from the shoulder edge to your desired sleeve length (elbow or full length).
                  </p>
                </div>
              </div>
            </div>

            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="https://i.pinimg.com/736x/84/83/a3/8483a3e052a8992081e42c8ce8bc7c53.jpg"
                alt="Blouse Measurement Guide"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Blouse Size Chart</CardTitle>
              <CardDescription>
                Find your size using the measurements below. If you fall between sizes, we recommend choosing the larger
                size.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full size-guide-table">
                  <thead>
                    <tr>
                      <th>Size</th>
                      <th>Bust (inches)</th>
                      <th>Waist (inches)</th>
                      <th>Hip (inches)</th>
                      <th>Shoulder (inches)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>32</td>
                      <td>32</td>
                      <td>28</td>
                      <td>35</td>
                      <td>14</td>
                    </tr>
                    <tr>
                      <td>34</td>
                      <td>34</td>
                      <td>30</td>
                      <td>37</td>
                      <td>14.5</td>
                    </tr>
                    <tr>
                      <td>36</td>
                      <td>36</td>
                      <td>32</td>
                      <td>39</td>
                      <td>15</td>
                    </tr>
                    <tr>
                      <td>38</td>
                      <td>38</td>
                      <td>34</td>
                      <td>41</td>
                      <td>15.5</td>
                    </tr>
                    <tr>
                      <td>40</td>
                      <td>40</td>
                      <td>36</td>
                      <td>43</td>
                      <td>16</td>
                    </tr>
                    <tr>
                      <td>42</td>
                      <td>42</td>
                      <td>38</td>
                      <td>45</td>
                      <td>16.5</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="bg-muted/30 p-6 rounded-lg">
            <h3 className="font-medium mb-2">Custom Tailoring</h3>
            <p className="mb-4">
              We offer custom tailoring services to ensure your blouse fits perfectly. Simply provide your measurements
              when placing your order, and our skilled tailors will create a blouse tailored to your exact
              specifications.
            </p>
            <Button asChild>
              <Link href="/contact">Contact Us for Custom Tailoring</Link>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="sarees" className="pt-6">
          <div className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Saree Information</h2>
            <p className="mb-6">
              Our sarees are standard 6.3 meters (5.5 yards) in length, which is suitable for most heights and draping
              styles. Each saree comes with an unstitched blouse piece of approximately 0.8 meters.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Saree Length</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Standard: 6.3 meters (5.5 yards)</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    This is the standard length for most sarees and is suitable for women of all heights.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Blouse Piece</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Standard: 0.8 meters</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Each saree comes with an unstitched blouse piece that can be tailored according to your
                    measurements.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="bg-muted/30 p-6 rounded-lg mb-8">
            <h3 className="font-medium mb-2">Draping Styles</h3>
            <p className="mb-4">
              There are various ways to drape a saree, depending on the occasion and regional preferences. The standard
              length of our sarees accommodates all traditional draping styles.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <div className="relative h-[200px] rounded-lg overflow-hidden">
                <Image
                  src="https://wp-admin.firstlook.fashion/wp-content/uploads/2024/12/Nivistylesareedraping2.jpg?impolicy=resize&r_width=459&r_height=300&resize=459,300&impolicy=resize&r_width=1&w=1"
                  alt="Nivi Style Draping"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                  <p className="text-white font-medium">Nivi Style</p>
                </div>
              </div>
              <div className="relative h-[200px] rounded-lg overflow-hidden">
                <Image
                  src="https://wp-admin.firstlook.fashion/wp-content/uploads/2024/12/aatpouresaree.jpg?impolicy=resize&r_width=459&r_height=300&resize=459,300&impolicy=resize&r_width=1&w=1?impolicy=resize&r_width=459&w=459&impolicy=resize&r_width=1&w=1"
                  alt="Bengali Style Draping"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                  <p className="text-white font-medium">Bengali Style</p>
                </div>
              </div>
              <div className="relative h-[200px] rounded-lg overflow-hidden">
                <Image
                  src="https://cdn.shopify.com/s/files/1/0592/3117/4816/files/Lehenga_Style_Gujarati_Saree_480x480.jpg?v=1666124863"
                  alt="Gujarati Style Draping"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                  <p className="text-white font-medium">Gujarati Style</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="font-medium mb-2">Need Help?</h3>
            <p className="text-muted-foreground mb-4">
              If you have any questions about saree measurements or draping styles, our team is here to help.
            </p>
            <Button asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

