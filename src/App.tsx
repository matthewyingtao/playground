import { Link, Route } from "wouter";
import Carousel from "./Carousel";
import Tiles from "./Tiles";

function App() {
	return (
		<main className="relative h-full bg-emerald-300 isolate">
			<nav className="flex justify-center gap-12 text-2xl">
				<Link href="/tiles">Tiles</Link>
				<Link href="/carousel">Carousel</Link>
			</nav>

			<Route path="/tiles" component={Tiles} />
			<Route path="/carousel" component={Carousel} />
		</main>
	);
}

export default App;
