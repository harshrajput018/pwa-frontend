import { useState, useEffect } from 'react';
import OpenAI from 'openai';
import ChatbotWindow from './chatbotwindow';

const Chatbot = () => {
    
    const [messages,setMessages]= useState([{"role":"user","content":"you are a mental health expert and you will ask me about how was my day and assist me on this just make it short and precise i want you to answer in 50-100 words . start off by asking how was your day ok ? just keep up the conversation dont let it end unless i tell you . after i press this just write - How are you feeling today ? "}]);
    

    const [flag,setFlag]= useState(false);
    useEffect(()=>{

        async function gg(){

            const openai = new OpenAI({
                
                apiKey: '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',
                dangerouslyAllowBrowser: true // Replace this with your actual API key
            });
    
            // Check if the create method exists before calling it
                
                
                const response = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: messages,
                    max_tokens:50
                   
                });
    
    
    
                setMessages(prev=>{
                    prev.push(response.choices[0].message);
                    return prev;
                })

                console.log('first',messages)

        }

        if(messages.length<=2)

        gg();

        


    },[])

    
        const fetchData = async (e) => {

            localStorage.setItem('loader','true')

            setMessages(prev=>{
                let temp = [...prev];
                
                temp.push({"role":"user","content":document.getElementById('question').value})
                
                return temp;
            })

            setFlag(true)

            
            
            
        };

        useEffect(()=>{

            document.getElementById('question').value=''

            if(messages.length>2)
            {
            setTimeout(async() => {

                try {
                    // Check if the OpenAI library is properly imported and instantiated
                    if (typeof OpenAI !== 'undefined' && OpenAI !== null) {
                        const openai = new OpenAI({
                            apiKey: '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',
                            dangerouslyAllowBrowser: true // Replace this with your actual API key
                        });
    
                        // Check if the create method exists before calling it
                            
                            console.log(messages)
                            const response = await openai.chat.completions.create({
                                model: "gpt-3.5-turbo",
                                messages: messages,
                                max_tokens:50
                               
                            });

                            localStorage.setItem('loader','false')

                            if(flag)
                            {
                                setFlag(false);
                                setMessages(prev=>{
                                    let temp = [...prev];
                                    temp.push(response.choices[0].message);
                                    return temp;


                                })
                            }
                            
    
                            
                            
                        
                    } else {
                        console.error('OpenAI library not properly imported or instantiated');
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
                            
            },500);



            
        }
        console.log(messages)
        },[messages])

        

     

    return (
        <div style={{width:'70%', margin:'0 auto', background:'white', boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'}}>
            <div style={{background:'royalblue', height:'10vh'}}></div>
            <ChatbotWindow dummyArray={messages.slice(2)}/>
            <div style={{width:'100%', display:'flex', gap:'5px'}}>
            <input style={{width:'100%',flex:'5',height:'10vh', borderRadius:'5px', border:'solid grey 2px'}} id='question' type="text" />
            <button onClick={()=>{fetchData()}} style={{flex:'1', borderRadius:'5px', background:'#3751d4', fontWeight:'700', color:'white', border:'none'}} onMouseEnter={(e)=>e.target.style.cursor='pointer'} >SEND</button>
            </div>
            
        </div>
    );
};

export default Chatbot;
