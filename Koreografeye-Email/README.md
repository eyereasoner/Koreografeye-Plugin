# Koreografeye Email plugin

An plugin to send an email to an address.

## Install

```
npm install koreografeye-email
```

Change the config.jsonld configuration file and add the plugin definition.

In `@context` add `"https://linkedsoftwaredependencies.org/bundles/npm/koreografeye-email/^1.0.0/components/context.jsonld"`.

Add the plugin definition:

```
{
  "@id": "http://example.org/sendEmail",
  "@type": "SendEmailPlugin",
  "host": "mail.gmx.com",
  "port": 465,
  "secure": true
}
```

## Usage

The Koreografeye N3 rules should produce a `ex:sendEmail` policy to trigger
this plugin. An example N3 rule file is provided below:

```
@prefix ex:   <http://example.org/> .
@prefix as:   <https://www.w3.org/ns/activitystreams#> .
@prefix pol:  <https://www.example.org/ns/policy#> .
@prefix fno:  <https://w3id.org/function/ontology#> .
@prefix string: <http://www.w3.org/2000/10/swap/string#> .

{
  ?id a as:Update .
}
=>
{
  ex:MyEmailPolicy pol:policy [
      a fno:Execution ;
      fno:executes ex:sendEmail ;
      ex:to "patrick.hochstenbach@gmail.com" ;
      ex:from "patrick_hochstenbach@gmx.net" ;
      ex:subject "A new resource was created!" ;
      ex:body "You got a new notification"
  ] .
}.
```

To execute the plugin an EMAIL_USERNAME and EMAIL_PASSWORD environment variable
needs to be set.