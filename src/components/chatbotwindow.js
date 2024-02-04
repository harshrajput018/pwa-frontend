import { useEffect } from "react";

export default function ChatbotWindow(props){
    const dummyArray = [
        { role: 'assistant', content: 'How was your day?' },
        { role: 'user', content: 'It didn\'t go well.' },
        { role: 'assistant', content: 'What did you do today?' },
        { role: 'user', content: 'I had some meetings.' },
        { role: 'assistant', content: 'Did anything interesting happen?' },
        { role: 'user', content: 'Not really, just the usual stuff.' },
        { role: 'assistant', content: 'Is there anything I can help you with?' },
        { role: 'assistant', content: 'Okay, feel free to ask if you need anything.' },
        { role: 'user', content: 'Sure, thanks!' }
      ];
      useEffect(()=>{

        var scrollable=document.getElementById('inner-scroll');
    scrollable.scrollTo(0, scrollable.scrollHeight-scrollable.clientHeight);

      },[props.dummyArray.length])
      
    return (
        <div>
            <div id="inner-scroll" style={{overflow:'scroll',height:'70vh',}}>
            
            <div style={{   padding:'1rem 1rem',display:'flex', flexDirection:'column',justifyContent:'flex-end'}}>
            <div style={{ width:'100%', display:'flex', justifyContent:'flex-start'}}>
                    <div  style={{
                padding:'1rem', background:'#114513', width:'40%', borderRadius:'5px', fontSize:'0.75rem',color:'white'}}>
                    Hey {localStorage.getItem('user')}! I'm here to make sure your day gets even better. How did your day treat you?
                </div>
                </div>
            {props.dummyArray.map((elem,index)=>{
                return (
                <div style={{ width:'100%', display:'flex', justifyContent:elem.role==='user'?'flex-end':'flex-start'}}>
                    {elem.role!=='user' && localStorage.getItem('loader')==='true' && index===props.dummyArray.length-1 ? <div className="loader"></div>:
                <div  style={{
                    padding:'1rem', background:elem.role==='user'?'#4663ac':'#114513', width:'40%', borderRadius:'5px', fontSize:'0.75rem', color:'white'}}>
                        {elem.content}
                    </div>}
                   
                </div>)
            })}
            </div>
            </div>
            
            
        </div>
    )
}