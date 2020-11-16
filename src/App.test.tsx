import React from 'react';
import { render } from '@testing-library/react';
import Filter from './View/Nodes/Filters/Filter';
import NodeTemplate from "./View/Nodes/NodeTemplate";

test('render filter node', () => {
  let filter = new Filter(0,0);
  const { getByText } = render(<NodeTemplate {...filter}></NodeTemplate> );
  const typeName = getByText(/Filtro/i);
  expect(typeName).toBeInTheDocument();
});
