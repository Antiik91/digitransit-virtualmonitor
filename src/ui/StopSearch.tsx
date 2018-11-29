import * as React from "react";
import { QueryResult } from 'react-apollo';
import { InjectedTranslateProps, translate } from "react-i18next";
import { isString } from "util";

import 'src/ui/StopSearch.css';
import StopsByNameRetriever, { IStopsByNameQuery, IStopsByNameResponse, IStopWithName } from "src/ui/StopsByNameRetriever";

type IProps = {
  readonly children?: (stops: ReadonlyArray<IStopWithName>) => React.ReactNode,
  readonly phrase?: string,
  readonly showTitle?: boolean,
} & InjectedTranslateProps;

interface IState {
  readonly searchPhrase: string,
};

class StopSearch extends React.Component<IProps, IState> {
  constructor (props: IProps) {
    super(props)
    this.state = {
      searchPhrase: props.phrase || '',
    };
  }

  static get defaultProps() {
    return {
      showTitle: false,
    };
  }

  public render() { return(
    <div className={'stop-selector'}>
      <form
        onSubmit={this.stopSearchSubmit}
        action={'searchStop'}
        method={'GET'}
      >
        {this.props.showTitle
          ? <h3>{this.props.t('stopSearcher')}</h3>
          : null
        }
        <label htmlFor={'stopSearchInput'}>
          {this.props.t('stopSearcherPhrase')}:&nbsp;
        </label>
        <input
          id={'stopSearchInput'}
          type={'text'}
          name={'searchPhrase'}
          defaultValue={this.props.phrase || ''}
        />
        &nbsp;
        <button
          type={'submit'}
        >
          {this.props.t('stopSearcherSearch')}
        </button>
      </form>
      {this.state.searchPhrase
        ? (
          <div>
            <span>{this.props.t('stopSearcherSearching', { searchPhrase: this.state.searchPhrase })}</span>
            <StopsByNameRetriever
              phrase={this.state.searchPhrase}
            >
              {(result: QueryResult<IStopsByNameResponse, IStopsByNameQuery>): React.ReactNode => {
                if (result.loading) {
                  return (<div>{this.props.t('loading')}</div>);
                }
                if (!result || !result.data) {
                  return (<div>
                    {this.props.t('stopSearchError', { searchPhrase: this.state.searchPhrase })}
                  </div>);
                }
                if (!result.data.stops || result.data.stops.length === 0) {
                  return (<div>
                    {this.props.t('stopSearchNotFound', { searchPhrase: this.state.searchPhrase })}
                  </div>);
                }
                return (this.props.children
                  ? this.props.children(result.data.stops)
                  : (
                    <ul>
                      {result.data.stops.map((stop) => (
                        <li key={stop.gtfsId}>
                          {stop.name} - {stop.gtfsId}
                        </li>
                      ))}
                    </ul>
                  )
                );
              }}
            </StopsByNameRetriever>
          </div>
        )
        : null
      }
    </div>
  )};

  protected stopSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.stopPropagation();
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    this.setState({ searchPhrase: isString(data.get('searchPhrase')) ? (data.get('searchPhrase') as string) : '' });
  }
}

export default translate('translations')(StopSearch);
