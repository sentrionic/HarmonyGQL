import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { User } from '../generated/graphql';
import { useApolloClient } from '@apollo/client';
import { gql } from '@apollo/client/core';

const getSuggestionValue = (suggestion: User) => {
  return suggestion.username;
};

const renderSuggestion = (suggestion: User) => (
  <div className={ 'list-row' }>
    <div className="list-item" data-id="19">
      <div><a href={suggestion.username} data-abc="true"><span className="w-48 avatar gd-primary">
        <img src={ suggestion.image } alt="." /></span></a></div>
      <div className="flex"><a href={suggestion.username} className="item-author text-color" data-abc="true">{ suggestion.username }</a>
        <div className="item-except text-muted text-sm h-1x">{ suggestion.displayName }
        </div>
      </div>
    </div>
  </div>
);

const SEARCH_QUERY = gql`
    query SearchProfiles($name: String!) {
        searchProfiles(name: $name) {
            image
            username
            displayName
        }
    }
`;

export const SearchBar: React.FC = ({}) => {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const client = useApolloClient();

  const onSuggestionsClearRequested = () => {
    setValue('');
    setSuggestions([]);
  };

  const onChange = (event: React.FormEvent, { newValue }: { newValue: string }) => {
    setValue(newValue);
  };

  return (
    <Autosuggest
      suggestions={ suggestions }
      getSuggestionValue={ getSuggestionValue }
      inputProps={ { placeholder: 'Search...', value, onChange } }
      onSuggestionsFetchRequested={ async ({ value }) => {
        if (value.length > 2) {
          const { data } = await client.query({
            query: SEARCH_QUERY,
            variables: { name: value },
          });
          setSuggestions(data.searchProfiles);
        }
      }
      }
      onSuggestionsClearRequested={ onSuggestionsClearRequested }
      renderSuggestion={ renderSuggestion }
    />
  );
};
