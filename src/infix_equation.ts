import { Stack, Node } from './stack'
import { CustomFraction, Operator, Parentheses } from './type_helper'

export type EquationElement = number | CustomFraction | Operator | Parentheses

export type NoFractionEquationElement = number | Operator | Parentheses

function computeFraction(fraction: CustomFraction): number {
  return fraction.numerator / fraction.denominator
}

function applyOperator(val1: number, val2: number, operator: string): number {
  switch(operator) {
    case '+': return val1 + val2
    case '-': return val1 - val2
    case '*': return val1 * val2
    case '/': return val1 / val2
    default: return 1
  }
}

function precedence(operator: string): number {
  if(operator == '+' || operator == '-') return 1
  if(operator == '*' || operator == '/') return 2

  return 0
}

export function isValid(elements: EquationElement[]): boolean {
  if (elements.length === 0) return true

  const parenthesesList = elements.filter(e => e === '(' || e === ')')
  if (parenthesesList.length === 0) return true

  const stack = new Stack<string>()

  for (let i = 0; i < parenthesesList.length; i++) {
    if (parenthesesList[i] === '(') {
      stack.push(new Node<string>('('))
    }
    else if (parenthesesList[i] === ')') {
      if (stack.size === 0) return false

      stack.pop()
    }
  }

  if (stack.size > 0) return false

  return true
}

export function evaluate(elements: EquationElement[]): number {

    // transform fraction to number
    const numberOnlyList: NoFractionEquationElement[] = elements.map(function(e: EquationElement): NoFractionEquationElement {
      if (typeof e === 'object') {
        return computeFraction(e)
      }
      return e
    })

    const valueStack = new Stack<number>()
    const operatorStack = new Stack<string>()

    // traverse list of element
    for (let i = 0; i < numberOnlyList.length; i++) {
      const e = numberOnlyList[i]

      // if open bracket, push to operator stack
      if (e === '(') {
        operatorStack.push(new Node<string>('('))
      }
      // if number, push to value stack
      else if (typeof e === 'number') {
        valueStack.push(new Node<number>(e))
      }
      // if close bracket, check operator stack, pop value until meet open bracket
      else if (e === ')') {
        // while meet operator, calculate
        while (!operatorStack.empty() && operatorStack.top!.value !== '(') {
          const val2: number = valueStack.top!.value
          valueStack.pop()

          const val1: number = valueStack.top!.value
          valueStack.pop()

          const op: string = operatorStack.top!.value
          operatorStack.pop()

          const res: number = applyOperator(val1, val2, op)
          valueStack.push(new Node<number>(res))
        }

        // meet open bracket, pop
        if (!operatorStack.empty()) operatorStack.pop()
      }
      // if operator
      else {
        // if precedence of current operator >= top of stack -> compute
        while (!operatorStack.empty() && precedence(operatorStack.top!.value) >= precedence(e)) {
          const val2: number = valueStack.top!.value
          valueStack.pop()

          const val1: number = valueStack.top!.value
          valueStack.pop()

          const op: string = operatorStack.top!.value
          operatorStack.pop()

          const res: number = applyOperator(val1, val2, op)
          valueStack.push(new Node<number>(res))
        }

        // else push to operator stack
        operatorStack.push(new Node<string>(e))
      }
    }

    while(!operatorStack.empty()) {
      const val2: number = valueStack.top!.value
      valueStack.pop()

      const val1: number = valueStack.top!.value
      valueStack.pop()

      const op: string = operatorStack.top!.value
      operatorStack.pop()

      const res: number = applyOperator(val1, val2, op)
      valueStack.push(new Node<number>(res))
    }

    const finalResult = valueStack.top!.value
    return finalResult
}
