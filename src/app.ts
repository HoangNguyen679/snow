import { evaluate, EquationElement } from "./infix_equation"
import Fraction from 'fraction.js'
import { evaluate as evaluateFraction, EquationElement as EquationElementFraction  } from "./fraction_use/infix_equation_fraction"

console.log('Start!!!')

const sampleData: [EquationElement[], string][] = [
  [[1, '+', 2],                              `Compute: 1 + 2 * 3 = `   ],
  [[1, '+', 2, '*', 3],                      `Compute: 1 + 2 * 3 = `   ],
  [['(', 1, '+', 2, ')', '*', 3],            `Compute: (1 + 2) * 3 = ` ],
  [[1, '+', {numerator: 1, denominator: 2}], `Compute: 1 + (1/2) = `   ],
  [[1, '+', {numerator: 1, denominator: 3}], `Compute: 1 + (1/3) = `   ],
  [[1, '+', {numerator: 1, denominator: 3}, '+', {numerator: 1, denominator: 2}], `Compute: 1 + (1/3) + (1/2)= ` ],
]

sampleData.forEach( (item) => {
  const result: number = evaluate(item[0])
  console.log(item[1] + `${result}`)
})

console.log('Finish!!!')

console.log('Start Fraction!!!')

const sampleData2: [EquationElementFraction[], string][] = [
  [[1, '+', 2],                                         `Compute: 1 + 2 * 3 = `        ],
  [[1, '+', 2, '*', 3],                                 `Compute: 1 + 2 * 3 = `        ],
  [['(', 1, '+', 2, ')', '*', 3],                       `Compute: (1 + 2) * 3 = `      ],
  [[1, '+', new Fraction(1,2)],                         `Compute: 1 + (1/2) = `        ],
  [[1, '+', new Fraction(1,3)],                         `Compute: 1 + (1/3) = `        ],
  [[1, '+', new Fraction(1,3), '+', new Fraction(1,2)], `Compute: 1 + (1/3) + (1/2)= ` ],
]

sampleData2.forEach( (item) => {
  const result: Fraction = evaluateFraction(item[0])
  console.log(item[1] + `${result.n}` + `/` + `${result.d}`)
})

console.log('Finish Fraction!!!')