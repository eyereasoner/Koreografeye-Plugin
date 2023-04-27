# Koreografeye Mastodon plugin

A [koreografeye](https://www.npmjs.com/package/koreografeye) plugin to send a toot to a Mastondon instance.

## Install

```
npm install koreografeye-mastodon
```

Change the [config.jsonld](https://raw.githubusercontent.com/eyereasoner/Koreografeye-Mastodon/main/config.jsonld) configuration file and add the plugin definition.

In `@context` add `"https://linkedsoftwaredependencies.org/bundles/npm/koreografeye-mastodon/^0.0.0/components/context.jsonld"`.

Add the plugin definition:

```
{
  "@id": "http://example.org/sendToMastodon",
  "@type": "MastodonPlugin",
  "test" : false
}
```

## Usage

The Koreografeye N3 rules should produce a `ex:sendToMastodon` policy to trigger
this plugin. An example N3 rule file is provided below:

```
@prefix ex:   <http://example.org/> .
@prefix as:   <https://www.w3.org/ns/activitystreams#> .
@prefix pol:  <https://www.example.org/ns/policy#> .
@prefix fno:  <https://w3id.org/function/ontology#> .
@prefix string: <http://www.w3.org/2000/10/swap/string#> .

{
  # pol:mainSubject defines the top level identifier of the notification
  [ pol:mainSubject ?id ] .
  
  ?id a as:Update .
  ( "koreografeye-mastodon demo : received an update for artifact " ?id) string:concatenation ?toot .
}
=>
{
  ex:MyDemoPolicy pol:policy [
      a fno:Execution ;
      fno:executes ex:sendToMastodon ;
      ex:baseurl "https://openbiblio.social" ;
      ex:toot ?toot 
  ] .
}.
```

The plugin requires two parameters:

- `ex:baseurl`  the baseurl of the Mastodon instance
- `ex:toot` the toot message to send to the instance

To execute the plugin a `MASTODON_ACCESS_TOKEN` environmental variable needs to 
be available. The content of the access token can be found in your personal
Mastodon `Preferences > Development > New Application`.

## Development

### Install dependencies

```
npm install 
```

### Build

```
npm run build
```

### Demo

In your Mastodon web environment find your `Preferences/Development` settings and create 
a new application. What we need is the access token for this new application.

Set the access token in your environment

```
export MASTODON_ACCESS_TOKEN=<...access token...>
```

Change in `config.jsonld` the `test` parameter to false:

```
{
  "@id": "http://example.org/sendToMastodon",
  "@type": "MastodonPlugin",
  "test" : false
}
```

Run an orchestrator run on `in/demo.ttl` using the `rules/demo.n3` N3 policy rules:

```
npm run orch
```

This should create a new `out/demo.ttl` file with the required N3 policies included.

Run the policy executor

```
npm run pol
```

The policy executor should have send a toot to your account (see `rules/demo.n3` how 
this toot was created).