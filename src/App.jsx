import Nav from "./components/Nav";
import Main from "./components/Main";
import { Analytics } from "@vercel/analytics/react"

const App = () => {
    return (
        <div>
            <Nav />
            <Main />
            <Analytics />
        </div>
    );
};
export default App;
