import React from 'react';
import axios from 'axios';
import {
  render,
  cleanup,
  fireEvent,
  getByText,
  prettyDOM,
  findByText,
  getAllByTestId,
  queryByText,
  queryByAltText,
  getByAltText,
  getByPlaceholderText,
  findByAltText,
  waitForElementToBeRemoved,
} from '@testing-library/react';

import Application from 'components/Application';

afterEach(cleanup);

describe('Application', () => {
  it('defaults to Monday and changes the schedule when a new day is selected', () => {
    const { queryByText, findByText } = render(<Application />);

    return findByText('Monday').then(() => {
      fireEvent.click(queryByText('Tuesday'));
      expect(queryByText('Leopold Silvers')).toBeInTheDocument();
    });
  });

  it('loads data, books an interview, and reduces the spots remaining for the first day by 1.', async () => {
    const { container, debug } = render(<Application />);

    await findByText(container, 'Archie Cohen');

    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, 'Add'));

    const input = getByPlaceholderText(appointment, /enter student name/i);
    fireEvent.change(input, { target: { value: 'Lydia Miller-Jones' } });

    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
    fireEvent.click(getByText(appointment, 'Save'));

    expect(getByText(appointment, /saving/i)).toBeInTheDocument();

    await findByText(appointment, 'Lydia Miller-Jones');

    const days = getAllByTestId(container, 'day');
    const found = days.find((day) => queryByText(day, 'Monday'));

    expect(found).toHaveTextContent('no spots remaining');
  });

  it('loads data, cancels an interview, and increases the spots remaining for Monday by 1.', async () => {
    const { container } = render(<Application />);

    const targetEl = await findByText(container, 'Archie Cohen');

    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments.find((appt) => appt.contains(targetEl));
    const days = getAllByTestId(container, 'day');
    const targetDay = days.find((day) => queryByText(day, 'Monday'));
    expect(targetDay).toHaveTextContent('1 spot remaining');

    fireEvent.click(getByAltText(appointment, 'Delete'));

    const confirm = await findByText(appointment, 'Confirm');
    expect(
      getByText(appointment, /Are you sure you want to delete?/i)
    ).toBeInTheDocument();

    fireEvent.click(confirm);

    expect(getByText(appointment, /Deleting/i)).toBeInTheDocument();
    await waitForElementToBeRemoved(() => getByText(appointment, /deleting/i));
    expect(targetDay).toHaveTextContent('2 spots remaining');
  });

  it('loads data, edits an interview, and keeps the spots remaining for Monday the same.', async () => {
    const { container, debug } = render(<Application />);

    const targetEl = await findByText(container, 'Archie Cohen');

    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments.find((appt) => appt.contains(targetEl));
    const days = getAllByTestId(container, 'day');
    const targetDay = days.find((day) => queryByText(day, 'Monday'));
    expect(targetDay).toHaveTextContent('1 spot remaining');

    fireEvent.click(getByAltText(appointment, 'Edit'));
    const save = await findByText(appointment, 'Save');

    const input = getByPlaceholderText(appointment, /enter student name/i);

    fireEvent.change(input, { target: { value: 'Aaron Hopkins' } });
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
    fireEvent.click(save);
    
    expect(getByText(appointment, /saving/i)).toBeInTheDocument();
    await waitForElementToBeRemoved(() => getByText(appointment, /saving/i));
    expect(targetDay).toHaveTextContent('1 spot remaining');
  });

  it('shows the save error when failing to save an appointment', async () => {
   const { container, debug } = render(<Application />);

   const targetEl = await findByText(container, 'Archie Cohen');

   const appointments = getAllByTestId(container, 'appointment');
   const appointment = appointments.find((appt) => appt.contains(targetEl));
   const days = getAllByTestId(container, 'day');
   const targetDay = days.find((day) => queryByText(day, 'Monday'));
   expect(targetDay).toHaveTextContent('1 spot remaining');

   fireEvent.click(getByAltText(appointment, 'Edit'));
   const save = await findByText(appointment, 'Save');

   const input = getByPlaceholderText(appointment, /enter student name/i);

   fireEvent.change(input, { target: { value: 'Aaron Hopkins' } });
   fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
   axios.put.mockRejectedValueOnce();
   fireEvent.click(save);
   await waitForElementToBeRemoved(() => getByText(appointment, /saving/i));
   expect(getByText(appointment, /error_save/i)).toBeInTheDocument();
  });

  it('shows the delete error when failing to delete an existing appointment', async () => {
    const { container } = render(<Application />);

    const targetEl = await findByText(container, 'Archie Cohen');

    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments.find((appt) => appt.contains(targetEl));
    const days = getAllByTestId(container, 'day');
    const targetDay = days.find((day) => queryByText(day, 'Monday'));
    expect(targetDay).toHaveTextContent('1 spot remaining');

    fireEvent.click(getByAltText(appointment, 'Delete'));

    const confirm = await findByText(appointment, 'Confirm');
    expect(
      getByText(appointment, /Are you sure you want to delete?/i)
    ).toBeInTheDocument();
    axios.delete.mockRejectedValueOnce();
    fireEvent.click(confirm);
    await waitForElementToBeRemoved(() => getByText(appointment, /deleting/i));
    expect(getByText(appointment, /error_delete/i)).toBeInTheDocument();
  });
});
