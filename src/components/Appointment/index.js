import React from 'react';

import 'components/Appointment/styles.scss';

import Header from 'components/Appointment/Header';

import Empty from 'components/Appointment/Empty';
import Show from 'components/Appointment/Show';
import useVisualMode from 'hooks/useVisualMode';
import Form from './Form';
import Confirm from './Confirm';
import Status from './Status';
import Error from './Error';

const EMPTY = 'EMPTY';
const SHOW = 'SHOW';
const CREATE = 'CREATE';
const EDIT = 'EDIT';
const SAVING = 'SAVING';
const DELETING = 'DELETING';
const CONFIRM = 'CONFIRM';
const ERROR_SAVE = 'ERROR_SAVE';
const ERROR_DELETE = 'ERROR_DELETE';

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };

    transition(SAVING);

    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch((error) => transition(ERROR_SAVE, true));
  }

  function destroy() {
    transition(DELETING, true);
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch((error) => transition(ERROR_DELETE, true));
  }

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition('CONFIRM')}
          onEdit={() => transition('EDIT')}
        />
      )}
      {mode === EMPTY && <Empty onAdd={() => transition('CREATE')} />}
      {(mode === CREATE || mode === EDIT) && (
        <Form
          interviewers={props.interviewers}
          name={props.interview?.student}
          interviewer={props.interview?.interviewer}
          onCancel={back}
          onSave={save}
        />
      )}
      {(mode === SAVING || mode === DELETING) && <Status message={mode} />}
      {(mode === ERROR_SAVE || mode === ERROR_DELETE) && (
        <Error message={mode} onClose={() => back()} />
      )}
      {mode === CONFIRM && (
        <Confirm
          message={'Are you sure you want to delete?'}
          onCancel={() => back()}
          onConfirm={() => destroy()}
        />
      )}
    </article>
  );
}
