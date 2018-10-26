import { RIENumber } from "@attently/riek";
import { Mutation } from '@loona/react';
import gql from 'graphql-tag';
import React = require('react');

import { IViewCarouselElement } from 'src/ui/ConfigurationList';
import ViewEditor from 'src/ui/ViewEditor';
import { ApolloClientsContext } from 'src/VirtualMonitorApolloClients';

export interface IViewCarouselElementEditorProps {
  readonly viewCarouselElement: IViewCarouselElement,
};

const setViewCarouselElementDisplaySecondsMutation = gql`
  mutation setViewCarouselElementDisplaySeconds($viewCarouselElementId: ID!, $displaySeconds: Float!) {
    setViewCarouselElementDisplaySeconds(viewCarouselElementId: $viewCarouselElementId, displaySeconds: $displaySeconds) @client
  }
`;

const removeViewCarouselElementMutation = gql`
  mutation removeViewCarouselElement($diplayId: ID!, $viewCarouselElementId: ID!) {
    removeViewCarouselElement(viewCarouselElementId: $viewCarouselElementId, displaySeconds: $displaySeconds) @client
  }
`;

const ViewCarouselElementEditor: React.SFC<IViewCarouselElementEditorProps> = ({ viewCarouselElement }: IViewCarouselElementEditorProps) => (
  <>
    <div>
      Näytetty aika:&#32;
      <ApolloClientsContext.Consumer>
        {({ virtualMonitor }) => (
          <>
            <Mutation
              mutation={setViewCarouselElementDisplaySecondsMutation}
              client={virtualMonitor}
            >
              {(setViewCarouselElementDisplaySeconds) =>
                (<>
                  <RIENumber
                    change={({ displaySeconds }: { displaySeconds: string}) =>
                      setViewCarouselElementDisplaySeconds({
                        variables: {
                          displaySeconds: parseFloat(displaySeconds),
                          viewCarouselElementId: viewCarouselElement.id,
                        }
                      })
                    }
                    propName={'displaySeconds'}
                    validate={(newNumber: string) => (parseFloat(newNumber) >= 0)}
                    value={viewCarouselElement.displaySeconds}
                  />&nbsp;sekuntia.
                  {viewCarouselElement.displaySeconds === 0
                    ? (<span> <b>Näkymä pois käytöstä.</b></span>)
                    : null
                  }
                </>)
              }
            </Mutation>
            <Mutation
              mutation={removeViewCarouselElementMutation}
              client={virtualMonitor}
            >
              {(removeViewCarouselElement) =>
                (<button
                  onClick={() => removeViewCarouselElement({ variables: {
                    displayId: 'aaaaaa',
                    viewCarouselElementId: viewCarouselElement.id,
                  }})}
                >
                  Poista näkymä.
                </button>)
              }
            </Mutation>
          </>
        )}
      </ApolloClientsContext.Consumer>
    </div>
    <ViewEditor view={viewCarouselElement.view} />
  </>
);

export default ViewCarouselElementEditor;
