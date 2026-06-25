import type { RemoteFormField, RemoteFormFieldValue } from "@sveltejs/kit";
import CheckboxInput from "./CheckboxInput.svelte";
import ComboBoxInput from "./ComboBoxInput.svelte";
import EmailInput from "./EmailInput.svelte";
import HiddenInput from "./HiddenInput.svelte";
import NumericInput from "./NumericInput.svelte";
import NumericTextInput from "./NumericTextInput.svelte";
import PasswordInput from "./PasswordInput.svelte";
import RadioInput from "./RadioInput.svelte";
import TextAreaInput from "./TextAreaInput.svelte";
import TextInput from "./TextInput.svelte";

export {
  CheckboxInput,
  ComboBoxInput,
  EmailInput,
  HiddenInput,
  NumericInput,
  NumericTextInput,
  PasswordInput,
  RadioInput,
  TextAreaInput,
  TextInput,
};

export interface InputProps<T extends RemoteFormFieldValue> {
  field: RemoteFormField<T>;
  label: string;
}
