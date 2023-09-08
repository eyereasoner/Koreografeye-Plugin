# Koreografeye Ntfy plugin

An plugin to send an handheld using the https://ntfy.sh service

## Install

```
npm install koreografeye-ntfy
```

Change the config.jsonld configuration file and add the plugin definition.

In `@context` add `"https://linkedsoftwaredependencies.org/bundles/npm/koreografeye-ntfy/^1.0.0/components/context.jsonld"`.

Add the plugin definition:

```
{
  "@id": "http://example.org/sendNtfy",
  "@type": "SendNtfyPlugin",
  "topic": "<your-topic-name>" 
}
```

## Usage

The Koreografeye N3 rules should produce a `ex:sendNtfy` policy to trigger
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
  ex:MyNtfyPolicy pol:policy [
      a fno:Execution ;
      fno:executes ex:sendNtfy ;
      ex:message "You got a new notification"
  ] .
}.
```

## Demo

When installing the source code from the https://github.com/eyereasoner/Koreografeye-Plugin 
one can run an email demo using the code example below:

```
# Run an orchestrator on the in/demo.ttl with rules/demo.n3
yarn orch
# Execute the resulting policy
yarn pol
```

where 

- `in/demo.ttl` is a demonstration [Event Notification](https://www.eventnotifications.net)
- `rules/demo.n3` is a demonstration rule that defined what to do with the notification 