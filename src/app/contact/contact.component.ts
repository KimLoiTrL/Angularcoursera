import { Component, OnInit, ViewChild } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { flyInOut, visibility } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    visibility()
  ]
})
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  errMess: string;
  feedback: Feedback;
  feedbackcopy: Feedback;
  visibility = 'hidden';
  contactType = ContactType;
  waitingForResponse = false;
  isHidden = false;
  @ViewChild('fform') feedbackFormDirective;

  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };

  constructor(
    private route: ActivatedRoute,
    private feedbackservice: FeedbackService,
    private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
    // this.route.params.pipe(switchMap((params: Params) => {this.visibility = 'hidden'; return this.feedbackservice.submitFeedback(); }))
    // .subscribe(feedback => { this.feedback = feedback; this.feedbackcopy = feedback; this.visibility = 'show'; },
    //   errmess => this.errMess = <any>errmess);
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: ['', [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  //SOS
  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.waitingForResponse = true;
    this.isHidden = true
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    // this.feedbackcopy.push(this.feedback);
    // this.feedbackservice.addFeedback(this.feedbackcopy)
    //   .subscribe(feedback => {
    //     this.feedback = feedback; this.feedbackcopy = feedback;
    //   },
    //   errmess => { this.feedback = null; this.feedbackcopy = null; this.errMess = <any>errmess; });
    this.feedbackservice.submitFeedback(this.feedback)
      .subscribe(feedbackResponse => {
        this.waitingForResponse = false;
        this.feedback = feedbackResponse;
        this.visibility = 'shown';
        setTimeout(() => {
          this.visibility = 'hidden';
          this.isHidden = false;
        }, 5000)

      });
    this.feedbackFormDirective.resetForm();
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: 0,
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
  }
}
