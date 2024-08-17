import { ValidationError } from 'class-validator';

export function extractErrorConstraints(errors: ValidationError[], errorMessages: any[] = []): any[] {
  for (const errorItem of errors) {
    if (errorItem?.constraints) {
      errorMessages.push(errorItem.constraints);
    } else if (errorItem?.children) {
      extractErrorConstraints(errorItem.children, errorMessages);
    }
  }
  return errorMessages;
}
