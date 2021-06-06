import { Stack, Node } from '../stack'
import { Operator, Parentheses } from '../type_helper'
import Fraction from 'fraction.js'

export type EquationElement = number | Fraction | Operator | Parentheses

export type FractionOnlyEquationElement = Fraction | Operator | Parentheses

function applyOperator(val1: Fraction, val2: Fraction, operator: string): Fraction {
  switch(operator) {
    case '+': return val1.add(val2)
    case '-': return val1.sub(val2)
    case '*': return val1.mul(val2)
    case '/': return val1.div(val2)
    default: return new Fraction(1)
  }
}

function precedence(operator: string): number {
  if(operator == '+' || operator == '-') return 1
  if(operator == '*' || operator == '/') return 2

  return 0
}

export function evaluate(elements: EquationElement[]): Fraction {

    // transform fraction to number
    const factionOnlyList: FractionOnlyEquationElement[] = elements.map(function(e: EquationElement): FractionOnlyEquationElement {
      if (typeof e === 'number') {
        return new Fraction(e)
      }
      return e
    })

    const valueStack = new Stack<Fraction>()
    const operatorStack = new Stack<string>()

    // traverse list of element
    for (let i = 0; i < factionOnlyList.length; i++) {
      const e = factionOnlyList[i]

      // if open bracket, push to operator stack
      if (e === '(') {
        operatorStack.push(new Node<string>('('))
      }
      // if number, push to value stack
      else if (typeof e === 'object') {
        valueStack.push(new Node<Fraction>(e))
      }
      // if close bracket, check operator stack, pop value until meet open bracket
      else if (e === ')') {
        // while meet operator, calculate
        while (!operatorStack.empty() && operatorStack.top!.value !== '(') {
          const val2: Fraction = valueStack.top!.value
          valueStack.pop()

          const val1: Fraction = valueStack.top!.value
          valueStack.pop()

          const op: string = operatorStack.top!.value
          operatorStack.pop()

          const res: Fraction = applyOperator(val1, val2, op)
          valueStack.push(new Node<Fraction>(res))
        }

        // meet open bracket, pop
        if (!operatorStack.empty()) operatorStack.pop()
      }
      // if operator
      else {
        // if precedence of current operator >= top of stack -> compute
        while (!operatorStack.empty() && precedence(operatorStack.top!.value) >= precedence(e)) {
          const val2: Fraction = valueStack.top!.value
          valueStack.pop()

          const val1: Fraction = valueStack.top!.value
          valueStack.pop()

          const op: string = operatorStack.top!.value
          operatorStack.pop()

          const res: Fraction = applyOperator(val1, val2, op)
          valueStack.push(new Node<Fraction>(res))
        }

        // else push to operator stack
        operatorStack.push(new Node<string>(e))
      }
    }

    while(!operatorStack.empty()) {
      const val2: Fraction = valueStack.top!.value
      valueStack.pop()

      const val1: Fraction = valueStack.top!.value
      valueStack.pop()

      const op: string = operatorStack.top!.value
      operatorStack.pop()

      const res: Fraction = applyOperator(val1, val2, op)
      valueStack.push(new Node<Fraction>(res))
    }

    const finalResult = valueStack.top!.value
    return finalResult
}
