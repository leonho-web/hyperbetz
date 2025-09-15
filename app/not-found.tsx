"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHome,
	faGamepad,
	faCrown,
	faDiceOne,
	faDiceSix,
	faCoins,
	faArrowLeft,
	faSparkles,
	faBolt,
} from "@fortawesome/pro-light-svg-icons";

export default function NotFound() {
	const router = useRouter();
	const [diceRolling, setDiceRolling] = useState(false);
	const [showWinAnimation, setShowWinAnimation] = useState(false);

	// Trigger casino animations on mount
	useEffect(() => {
		const timer = setTimeout(() => {
			setShowWinAnimation(true);
		}, 500);

		return () => clearTimeout(timer);
	}, []);

	const handleDiceRoll = () => {
		setDiceRolling(true);
		setTimeout(() => {
			setDiceRolling(false);
			setShowWinAnimation(true);
		}, 1000);
	};

	const quickLinks = [
		{
			href: "/",
			label: "Home",
			icon: faHome,
			description: "Return to main lobby",
		},
		{
			href: "/games",
			label: "Games",
			icon: faGamepad,
			description: "Browse all games",
		},
		{
			href: "/providers",
			label: "Providers",
			icon: faCrown,
			description: "Check out our Games Providers",
		},
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-card to-background relative overflow-hidden">
			{/* Animated Background Elements */}
			<div className="absolute inset-0 pointer-events-none">
				{/* Floating casino chips */}
				<div className="absolute top-20 left-10 w-8 h-8 bg-primary rounded-full animate-float opacity-20" />
				<div className="absolute top-40 right-20 w-6 h-6 bg-chart-1 rounded-full animate-float animation-delay-300 opacity-15" />
				<div className="absolute bottom-32 left-1/4 w-10 h-10 bg-chart-2 rounded-full animate-float animation-delay-150 opacity-25" />

				{/* Sparkle effects */}
				<div className="absolute top-1/4 right-1/4 text-primary/30">
					<FontAwesomeIcon
						icon={faSparkles}
						className="w-6 h-6 animate-pulse"
					/>
				</div>
				<div className="absolute bottom-1/3 left-1/3 text-chart-1/20">
					<FontAwesomeIcon
						icon={faSparkles}
						className="w-8 h-8 animate-pulse animation-delay-300"
					/>
				</div>

				{/* Coin stack illustrations */}
				<div className="absolute top-16 right-1/3 flex items-end space-x-1 opacity-10">
					<div className="w-4 h-8 bg-yellow-500 rounded-full" />
					<div className="w-4 h-12 bg-yellow-500 rounded-full" />
					<div className="w-4 h-6 bg-yellow-500 rounded-full" />
				</div>
			</div>

			<div className="container mx-auto px-4 py-16 relative z-10">
				<div className="max-w-4xl mx-auto text-center">
					{/* Main 404 Display */}
					<div className="mb-12">
						<div className="flex justify-center items-center gap-4 mb-8">
							<div
								className={`transition-transform duration-1000 ${
									diceRolling ? "animate-spin" : ""
								}`}
								onClick={handleDiceRoll}
							>
								<FontAwesomeIcon
									icon={faDiceOne}
									fontSize={64}
									className="text-primary cursor-pointer hover:text-chart-1 transition-colors"
								/>
							</div>

							<div className="relative">
								<h1 className="text-9xl font-black bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent animate-gradient-x">
									404
								</h1>
								{showWinAnimation && (
									<div className="absolute -top-4 -right-4 animate-bounce">
										<FontAwesomeIcon
											icon={faCoins}
											className="w-8 h-8 text-yellow-500"
										/>
									</div>
								)}
							</div>

							<div
								className={`transition-transform duration-1000 ${
									diceRolling ? "animate-spin" : ""
								}`}
								onClick={handleDiceRoll}
							>
								<FontAwesomeIcon
									icon={faDiceSix}
									fontSize={64}
									className="text-chart-1 cursor-pointer hover:text-primary transition-colors"
								/>
							</div>
						</div>

						<div className="space-y-4">
							<h2 className="text-3xl md:text-4xl font-bold casino-heading-enhanced">
								Page Not Found!
							</h2>
							<p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
								Looks like this page took a gamble and lost! But
								don&apos;t worry, the house always has more
								games to play.
							</p>
							<div className="flex justify-center items-center gap-2 text-sm text-primary/70">
								<FontAwesomeIcon
									icon={faBolt}
									className="w-4 h-4"
								/>
								<span>
									The odds are in your favor elsewhere
								</span>
								<FontAwesomeIcon
									icon={faBolt}
									className="w-4 h-4"
								/>
							</div>
						</div>
					</div>

					{/* Casino-themed message */}
					{/* <Card className="mb-12 casino-sidebar-glass border-primary/20 shadow-lg">
            <CardContent className="p-8">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Crown className="w-8 h-8 text-primary animate-pulse" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4 casino-text-glow">
                High Roller&apos;s Tip
              </h3>
              <p className="text-muted-foreground text-lg">
                Every great player knows when to fold and when to double down. 
                This might be a fold, but your next big win is just a click away!
              </p>
            </CardContent>
          </Card> */}

					{/* Action Buttons */}
					<div className="grid md:grid-cols-2 gap-6 mb-12">
						<Button
							size="lg"
							onClick={() => router.back()}
							className="casino-theme-button h-14 text-lg relative overflow-hidden group"
						>
							<FontAwesomeIcon
								icon={faArrowLeft}
								className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
							/>
							Go Back
							<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
						</Button>

						<Button
							size="lg"
							variant="outline"
							asChild
							className="h-14 text-lg border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300"
						>
							<Link href="/">
								<FontAwesomeIcon
									icon={faHome}
									fontSize={22}
									className="mr-2 text-primary"
								/>
								Return Home
							</Link>
						</Button>
					</div>

					{/* Quick Navigation Cards */}
					<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{quickLinks.map((link, index) => (
							<Card
								key={link.href}
								className={`casino-button-glass border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 animate-fade-in-up`}
								style={{ animationDelay: `${index * 100}ms` }}
							>
								<CardContent className="p-6 text-center">
									<div className="flex justify-center mb-3">
										<div className="p-3 bg-primary/10 rounded-full">
											<FontAwesomeIcon
												icon={link.icon}
												fontSize={24}
												className="text-primary"
											/>
										</div>
									</div>
									<h4 className="font-semibold mb-2">
										{link.label}
									</h4>
									<p className="text-sm text-muted-foreground mb-4">
										{link.description}
									</p>
									<Button
										asChild
										variant="outline"
										size="sm"
										className="w-full"
									>
										<Link href={link.href}>Visit</Link>
									</Button>
								</CardContent>
							</Card>
						))}
					</div>

					{/* Footer Message */}
					<div className="mt-16 pt-8 border-t border-border/50">
						<p className="text-sm text-muted-foreground">
							Remember: In this casino, every spin is a new
							opportunity.
							<span className="text-primary font-medium">
								{" "}
								The next jackpot awaits!
							</span>
						</p>
					</div>
				</div>
			</div>

			{/* Ambient glow effects */}
			<div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
			<div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-chart-1/5 rounded-full blur-3xl animate-pulse animation-delay-300" />
		</div>
	);
}
