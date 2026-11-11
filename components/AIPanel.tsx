import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $createParagraphNode, $createTextNode } from 'lexical';
import { SendHorizonal, Loader2 } from 'lucide-react';


const AIPanel = () => {
    const [aiPrompt, setAiPrompt] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [editor] = useLexicalComposerContext();

    function onChangePrompt(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const { value } = event.target;
        setAiPrompt(value);
    }

    async function submitAIPrompt() {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/prompt-gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: aiPrompt }),
            });

            const result: { response?: unknown; message?: unknown } | null = await response.json().catch(() => null);
            if (!response.ok) {
                throw new Error(typeof result?.message === 'string' ? result.message : 'AI text generation failed. Please try again.');
            }
            const text = result?.response;
            if (typeof text !== 'string' || !text.trim()) throw new Error('No text was generated. Please try another prompt.');
            editor.update(() => {
                const root = $getRoot();
                const paragraph = $createParagraphNode();
                paragraph.append($createTextNode(text));
                root.append(paragraph);
            });
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Unknown error');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-[#1e1e20]">
            <div className='w-full border flex flex-col gap-5 items-end p-5'>
                <textarea
                    name="aiPrompt"
                    id="aiPrompt"
                    aria-label="AI writing prompt"
                    maxLength={8000}
                    placeholder='Write a prompt for the AI. eg. "Write a story about a dragon and a knight"'
                    value={aiPrompt}
                    onChange={onChangePrompt}
                    className='w-full h-24 p-2 text-gray-50 bg-transparent'
                >

                </textarea>


                <Button
                    type="button"
                    className="gradient-blue flex gap-1 shadow-md float-right "
                    onClick={submitAIPrompt}
                    disabled={loading || !aiPrompt.trim()}
                >
                    {loading
                        ? <span className='flex justify-center items-center gap-2'>
                            Generating 
                            <Loader2 height={14} width={14} 
                                className='animate-spin'
                            />
                        </span> :
                        <span className='flex justify-center items-center gap-2'>
                            Generate <SendHorizonal height={14} width={14} />
                        </span>
                    }
                </Button>
            </div>

            <div>
                {error && <p role="alert" className="text-red-300">{error}</p>}
            </div>
        </div>
    );
};

export default AIPanel;
