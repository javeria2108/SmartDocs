'use client';

import Theme from './plugins/Theme';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import { HeadingNode } from '@lexical/rich-text';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import React from 'react';

import { FloatingComposer, FloatingThreads, liveblocksConfig, LiveblocksPlugin, useEditorStatus } from '@liveblocks/react-lexical';
import Loader from '../Loader';

import { useThreads } from '@liveblocks/react/suspense';
import FloatingToolbarPlugin from './plugins/FloatingToolbarPlugin';
import Comments from '../Comments';
import { DeleteModal } from '../DeleteModal';
import AIPanel from '@/components/AIPanel';
import ShareModal from '../ShareModal';

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

export function Editor({ roomId, currentUserType, collaborators, creatorId }: { roomId: string, currentUserType: UserType, collaborators: User[], creatorId: string }) {
  const status = useEditorStatus();
  const { threads } = useThreads();

  const initialConfig = liveblocksConfig({
    namespace: 'Editor',
    nodes: [HeadingNode],
    onError: (error: Error) => {
      console.error(error);
      throw error;
    },
    theme: Theme,
    editable: currentUserType === 'editor',
  });

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container size-full">
        {currentUserType === 'editor' && (
          <div className="toolbar-wrapper flex min-w-full justify-between mb-4">
            <ToolbarPlugin />
            <DeleteModal roomId={roomId} />
          </div>
        )}

        <div className="editor-wrapper flex flex-col items-center justify-start">
          {status === 'not-loaded' || status === 'loading' ? (
            <Loader />
          ) : (
            <div className="editor-inner min-h-[1100px] relative mb-5 h-fit w-full max-w-[800px] shadow-md lg:mb-10">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="editor-input h-full" />
                }
                placeholder={<Placeholder />}
                ErrorBoundary={LexicalErrorBoundary}
              />
              {currentUserType === 'editor' && <FloatingToolbarPlugin />}
              <HistoryPlugin />
              <AutoFocusPlugin />
            </div>
          )}

          <LiveblocksPlugin>
            <FloatingComposer className="w-[350px]" />
            <FloatingThreads threads={threads} />
            <div className="side-panel-container">
              <Comments />
              {currentUserType === 'editor' && (
                <ShareModal
                  roomId={roomId}
                  collaborators={collaborators}
                  creatorId={creatorId}
                  currentUserType={currentUserType}
                />
              )}
              <AIPanel />
            </div>
          </LiveblocksPlugin>
        </div>
      </div>
    </LexicalComposer>
  );
}
