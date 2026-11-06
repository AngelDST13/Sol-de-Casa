import { Card, ScrollTable } from '../../../shared/components/index.js';
import { FOUR_QUESTIONS } from '../content.js';

/** Pregunta 6: las cuatro preguntas del cliente, desde la familia y desde el vecino. */
export const FourQuestions = () => (
  <Card title="Las cuatro preguntas del cliente" eyebrow="Pregunta 6 · Revisión del prototipo">
    <ScrollTable caption="Cuatro preguntas del cliente">
      <thead>
        <tr>
          <th scope="col">Pregunta</th>
          <th scope="col" style={{ textAlign: 'left' }}>
            La familia que comparte
          </th>
          <th scope="col" style={{ textAlign: 'left' }}>
            El vecino
          </th>
        </tr>
      </thead>
      <tbody>
        {FOUR_QUESTIONS.map((row) => (
          <tr key={row.question}>
            <td>
              <strong>{row.question}</strong>
            </td>
            <td style={{ textAlign: 'left', whiteSpace: 'normal', minWidth: 200 }}>{row.family}</td>
            <td style={{ textAlign: 'left', whiteSpace: 'normal', minWidth: 200 }}>{row.neighbor}</td>
          </tr>
        ))}
      </tbody>
    </ScrollTable>
  </Card>
);
