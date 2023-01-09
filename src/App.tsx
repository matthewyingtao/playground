import { Link, Route } from "wouter";
import Carousel from "./routes/Carousel";
import Lamp from "./routes/Lamp";
import Tiles from "./routes/Tiles";

function App() {
	return (
		<main className="relative h-full min-h-screen bg-emerald-300 isolate grid grid-rows-[auto_1fr] w-full">
			<nav className="flex justify-center gap-12 text-2xl">
				<Link href="/tiles">Tiles</Link>
				<Link href="/carousel">Carousel</Link>
				<Link href="/lamp">Lamp</Link>
			</nav>

			<Route path="/tiles" component={Tiles} />
			<Route path="/carousel" component={Carousel} />
			<Route path="/lamp" component={Lamp} />
		</main>
	);
}

export default App;
