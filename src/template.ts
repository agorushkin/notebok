export class Template {
  text: string;
  
  constructor(base: string) {
    this.text = base;
  }

  insert(value: string, key: string) {
    this.text = this.text.replace(`{{ ${ key } }}`, value);
  }

  clear() {
    this.text = this.text.replace(/{{ [a-z]+ }}/g, '');
  }
}