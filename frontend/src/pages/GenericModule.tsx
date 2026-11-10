import SimplePage from "../components/SimplePage";
export default function GenericModule({title,back}:{title:string;back:string}){return <SimplePage title={title} back={back}><div className="card"><p>Módulo convertido a React. La página original estaba vacía o solo contenía la estructura inicial.</p></div></SimplePage>}
