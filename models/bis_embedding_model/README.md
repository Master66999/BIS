---
tags:
- sentence-transformers
- sentence-similarity
- feature-extraction
- dense
- generated_from_trainer
- dataset_size:12435
- loss:MultipleNegativesRankingLoss
base_model: sentence-transformers/all-MiniLM-L6-v2
widget:
- source_sentence: is 7251:1974 cement & concrete
  sentences:
  - 'IS 7251:1974: Specification for concrete finishers. Type: Product Specification.
    Category: Cement & Concrete.'
  - 'IS 9650:1980: Hook, Joseph''s Pattern. Type: Product Specification. Category:
    General Engineering & Technical.'
  - 'IS 13008:1990: Shallow corrugated asbestos cement sheets -. Type: Product Specification.
    Category: Cement & Concrete.'
- source_sentence: is 5663:1970 civil & construction
  sentences:
  - 'SP 25(S&T):1984: Handbook on causes and prevention of cracks in building. Type:
    Others. Category: Civil & Construction.'
  - 'IS 5663:1970: Specification for Brick and Mason. Type: Product Specification.
    Category: Civil & Construction.'
  - 'IS 17532:2021: ATM Safes-Specification. Type: Product Specification. Category:
    General Engineering & Technical.'
- source_sentence: is 9100:1979 mechanical & metallurgy
  sentences:
  - 'IS 9100:1979: Methods of sampling steel forgings. Type: Code of Practice. Category:
    Mechanical & Metallurgy.'
  - 'IS 15279:2026: SUGAR - METHODS OF TEST. Type: Methods of Tests. Category: Food
    & Agriculture.'
  - 'IS 10839:1984: Jewellers'' Saw. Type: Product Specification. Category: General
    Engineering & Technical.'
- source_sentence: is 18219:2023 civil & construction
  sentences:
  - 'IS/ISO 3163:2022: Adventure Tourism Vocabulary. Type: Terminology. Category:
    General Engineering & Technical.'
  - 'IS 10759:1983: Brewer''s Yeast. Type: Product Specification. Category: General
    Engineering & Technical.'
  - 'IS 18219:2023: Borosilicate glass 3.3 - Properties. Type: Product Specification.
    Category: Civil & Construction.'
- source_sentence: is 10839:1984 general engineering & technical
  sentences:
  - 'IS 10839:1984: Jewellers'' Saw. Type: Product Specification. Category: General
    Engineering & Technical.'
  - 'IS 19297:2025: Ships and Marine Technology Cyber Safety. Type: Others. Category:
    General Engineering & Technical.'
  - 'IS 13441:1992: Ethyl ether - Code of safety. Type: Code of Practice. Category:
    General Engineering & Technical.'
pipeline_tag: sentence-similarity
library_name: sentence-transformers
---

# SentenceTransformer based on sentence-transformers/all-MiniLM-L6-v2

This is a [sentence-transformers](https://www.SBERT.net) model finetuned from [sentence-transformers/all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2). It maps inputs to a 384-dimensional dense vector space and can be used for semantic textual similarity, semantic search, paraphrase mining, classification, clustering, and more.

## Model Details

### Model Description
- **Model Type:** Sentence Transformer
- **Base model:** [sentence-transformers/all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) <!-- at revision 1110a243fdf4706b3f48f1d95db1a4f5529b4d41 -->
- **Maximum Sequence Length:** 256 tokens
- **Output Dimensionality:** 384 dimensions
- **Similarity Function:** Cosine Similarity
- **Supported Modality:** Text
<!-- - **Training Dataset:** Unknown -->
<!-- - **Language:** Unknown -->
<!-- - **License:** Unknown -->

### Model Sources

- **Documentation:** [Sentence Transformers Documentation](https://sbert.net)
- **Repository:** [Sentence Transformers on GitHub](https://github.com/huggingface/sentence-transformers)
- **Hugging Face:** [Sentence Transformers on Hugging Face](https://huggingface.co/models?library=sentence-transformers)

### Full Model Architecture

```
SentenceTransformer(
  (0): Transformer({'transformer_task': 'feature-extraction', 'modality_config': {'text': {'method': 'forward', 'method_output_name': 'last_hidden_state'}}, 'module_output_name': 'token_embeddings', 'architecture': 'BertModel'})
  (1): Pooling({'embedding_dimension': 384, 'pooling_mode': 'mean', 'include_prompt': True})
  (2): Normalize({'module_input_name': 'sentence_embedding', 'module_output_name': 'sentence_embedding'})
)
```

## Usage

### Direct Usage (Sentence Transformers)

First install the Sentence Transformers library:

```bash
pip install -U sentence-transformers
```
Then you can load this model and run inference.
```python
from sentence_transformers import SentenceTransformer

# Download from the 🤗 Hub
model = SentenceTransformer("sentence_transformers_model_id")
# Run inference
sentences = [
    'is 10839:1984 general engineering & technical',
    "IS 10839:1984: Jewellers' Saw. Type: Product Specification. Category: General Engineering & Technical.",
    'IS 13441:1992: Ethyl ether - Code of safety. Type: Code of Practice. Category: General Engineering & Technical.',
]
embeddings = model.encode(sentences)
print(embeddings.shape)
# [3, 384]

# Get the similarity scores for the embeddings
similarities = model.similarity(embeddings, embeddings)
print(similarities)
# tensor([[ 1.0000,  0.7179,  0.0197],
#         [ 0.7179,  1.0000, -0.0440],
#         [ 0.0197, -0.0440,  1.0000]])
```
<!--
### Direct Usage (Transformers)

<details><summary>Click to see the direct usage in Transformers</summary>

</details>
-->

<!--
### Downstream Usage (Sentence Transformers)

You can finetune this model on your own dataset.

<details><summary>Click to expand</summary>

</details>
-->

<!--
### Out-of-Scope Use

*List how the model may foreseeably be misused and address what users ought not to do with the model.*
-->

<!--
## Bias, Risks and Limitations

*What are the known or foreseeable issues stemming from this model? You could also flag here known failure cases or weaknesses of the model.*
-->

<!--
### Recommendations

*What are recommendations with respect to the foreseeable issues? For example, filtering explicit content.*
-->

## Training Details

### Training Dataset

#### Unnamed Dataset

* Size: 12,435 training samples
* Columns: <code>anchor</code> and <code>positive</code>
* Approximate statistics based on the first 100 samples:
  |          | anchor                                                                            | positive                                                                            |
  |:---------|:----------------------------------------------------------------------------------|:------------------------------------------------------------------------------------|
  | type     | string                                                                            | string                                                                              |
  | modality | text                                                                              | text                                                                                |
  | details  | <ul><li>min: 7 tokens</li><li>mean: 16.07 tokens</li><li>max: 32 tokens</li></ul> | <ul><li>min: 68 tokens</li><li>mean: 93.48 tokens</li><li>max: 144 tokens</li></ul> |
* Samples:
  | anchor                                                                                                                                  | positive                                                                                                                                                                                                                                                                                                                                                                     |
  |:----------------------------------------------------------------------------------------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
  | <code>What is the requirement for IS 269:2015 — Ordinary Portland Cement — Specification (Sixth Revision) under clause Clause 1?</code> | <code>IS 269:2015 IS 269:2015 — Ordinary Portland Cement — Specification (Sixth Revision) (Clause Clause 1): Scope: This standard covers the manufacture and chemical and physical requirements of 33 grade, 43 grade and 53 grade ordinary Portland cement. Portland cement is designated as OPC 33, OPC 43 and OPC 53 according to the 28-day compressive strength.</code> |
  | <code>IS 269:2015 testing requirements and limits</code>                                                                                | <code>IS 269:2015 IS 269:2015 — Ordinary Portland Cement — Specification (Sixth Revision) (Clause Clause 1): Scope: This standard covers the manufacture and chemical and physical requirements of 33 grade, 43 grade and 53 grade ordinary Portland cement. Portland cement is designated as OPC 33, OPC 43 and OPC 53 according to the 28-day compressive strength.</code> |
  | <code>Indian standard specification for Cement</code>                                                                                   | <code>IS 269:2015 IS 269:2015 — Ordinary Portland Cement — Specification (Sixth Revision) (Clause Clause 1): Scope: This standard covers the manufacture and chemical and physical requirements of 33 grade, 43 grade and 53 grade ordinary Portland cement. Portland cement is designated as OPC 33, OPC 43 and OPC 53 according to the 28-day compressive strength.</code> |
* Loss: [<code>MultipleNegativesRankingLoss</code>](https://sbert.net/docs/package_reference/sentence_transformer/losses.html#multiplenegativesrankingloss) with these parameters:
  ```json
  {
      "scale": 20.0,
      "similarity_fct": "cos_sim",
      "gather_across_devices": false,
      "directions": [
          "query_to_doc"
      ],
      "partition_mode": "joint",
      "hardness_mode": null,
      "hardness_strength": 0.0
  }
  ```

### Training Hyperparameters
#### Non-Default Hyperparameters

- `per_device_train_batch_size`: 32
- `num_train_epochs`: 1
- `learning_rate`: 2e-05
- `warmup_steps`: 0.1
- `fp16`: True

#### All Hyperparameters
<details><summary>Click to expand</summary>

- `per_device_train_batch_size`: 32
- `num_train_epochs`: 1
- `max_steps`: -1
- `learning_rate`: 2e-05
- `lr_scheduler_type`: linear
- `lr_scheduler_kwargs`: None
- `warmup_steps`: 0.1
- `optim`: adamw_torch_fused
- `optim_args`: None
- `weight_decay`: 0.0
- `adam_beta1`: 0.9
- `adam_beta2`: 0.999
- `adam_epsilon`: 1e-08
- `optim_target_modules`: None
- `gradient_accumulation_steps`: 1
- `average_tokens_across_devices`: True
- `max_grad_norm`: 1.0
- `label_smoothing_factor`: 0.0
- `bf16`: False
- `fp16`: True
- `bf16_full_eval`: False
- `fp16_full_eval`: False
- `tf32`: None
- `gradient_checkpointing`: False
- `gradient_checkpointing_kwargs`: None
- `torch_compile`: False
- `torch_compile_backend`: None
- `torch_compile_mode`: None
- `use_liger_kernel`: False
- `liger_kernel_config`: None
- `use_cache`: False
- `neftune_noise_alpha`: None
- `torch_empty_cache_steps`: None
- `auto_find_batch_size`: False
- `log_on_each_node`: True
- `logging_nan_inf_filter`: True
- `include_num_input_tokens_seen`: no
- `log_level`: passive
- `log_level_replica`: warning
- `disable_tqdm`: False
- `project`: huggingface
- `trackio_space_id`: trackio
- `per_device_eval_batch_size`: 8
- `prediction_loss_only`: True
- `eval_on_start`: False
- `eval_do_concat_batches`: True
- `eval_use_gather_object`: False
- `eval_accumulation_steps`: None
- `include_for_metrics`: []
- `batch_eval_metrics`: False
- `save_only_model`: False
- `save_on_each_node`: False
- `enable_jit_checkpoint`: False
- `push_to_hub`: False
- `hub_private_repo`: None
- `hub_model_id`: None
- `hub_strategy`: every_save
- `hub_always_push`: False
- `hub_revision`: None
- `load_best_model_at_end`: False
- `ignore_data_skip`: False
- `restore_callback_states_from_checkpoint`: False
- `full_determinism`: False
- `seed`: 42
- `data_seed`: None
- `use_cpu`: False
- `accelerator_config`: {'split_batches': False, 'dispatch_batches': None, 'even_batches': True, 'use_seedable_sampler': True, 'non_blocking': False, 'gradient_accumulation_kwargs': None}
- `parallelism_config`: None
- `dataloader_drop_last`: False
- `dataloader_num_workers`: 0
- `dataloader_pin_memory`: True
- `dataloader_persistent_workers`: False
- `dataloader_prefetch_factor`: None
- `remove_unused_columns`: True
- `label_names`: None
- `train_sampling_strategy`: random
- `length_column_name`: length
- `ddp_find_unused_parameters`: None
- `ddp_bucket_cap_mb`: None
- `ddp_broadcast_buffers`: False
- `ddp_backend`: None
- `ddp_timeout`: 1800
- `fsdp`: []
- `fsdp_config`: {'min_num_params': 0, 'xla': False, 'xla_fsdp_v2': False, 'xla_fsdp_grad_ckpt': False}
- `deepspeed`: None
- `debug`: []
- `skip_memory_metrics`: True
- `do_predict`: False
- `resume_from_checkpoint`: None
- `warmup_ratio`: None
- `local_rank`: -1
- `prompts`: None
- `batch_sampler`: batch_sampler
- `multi_dataset_batch_sampler`: proportional
- `router_mapping`: {}
- `learning_rate_mapping`: {}

</details>

### Training Logs
| Epoch  | Step | Training Loss |
|:------:|:----:|:-------------:|
| 0.1285 | 50   | 0.1515        |
| 0.2571 | 100  | 0.0082        |
| 0.3856 | 150  | 0.0076        |
| 0.5141 | 200  | 0.0102        |
| 0.6427 | 250  | 0.0156        |
| 0.7712 | 300  | 0.0078        |
| 0.8997 | 350  | 0.0045        |


### Training Time
- **Training**: 43.3 seconds

### Framework Versions
- Python: 3.13.5
- Sentence Transformers: 6.1.0
- Transformers: 5.3.0
- PyTorch: 2.11.0+cu128
- Accelerate: 1.12.0
- Datasets: 4.5.0
- Tokenizers: 0.22.2

## Additional Resources

- [Training and Finetuning Embedding Models with Sentence Transformers](https://huggingface.co/blog/train-sentence-transformers): the end-to-end guide for training or finetuning Sentence Transformer models.
- [Introduction to Matryoshka Embedding Models](https://huggingface.co/blog/matryoshka): variable-size embeddings that can be truncated with minimal quality loss.
- [Binary and Scalar Embedding Quantization for Significantly Faster & Cheaper Retrieval](https://huggingface.co/blog/embedding-quantization): post-training compression of embedding vectors.
- [Multimodal Embedding & Reranker Models with Sentence Transformers](https://huggingface.co/blog/multimodal-sentence-transformers): use text, image, audio, and video models through the same API.
- [Training and Finetuning Multimodal Embedding & Reranker Models with Sentence Transformers](https://huggingface.co/blog/train-multimodal-sentence-transformers): train multimodal embedding models, with a Visual Document Retrieval walkthrough.

## Citation

### BibTeX

#### Sentence Transformers
```bibtex
@inproceedings{reimers-2019-sentence-bert,
    title = "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks",
    author = "Reimers, Nils and Gurevych, Iryna",
    booktitle = "Proceedings of the 2019 Conference on Empirical Methods in Natural Language Processing",
    month = "11",
    year = "2019",
    publisher = "Association for Computational Linguistics",
    url = "https://arxiv.org/abs/1908.10084",
}
```

#### MultipleNegativesRankingLoss
```bibtex
@misc{oord2019representationlearningcontrastivepredictive,
      title={Representation Learning with Contrastive Predictive Coding},
      author={Aaron van den Oord and Yazhe Li and Oriol Vinyals},
      year={2019},
      eprint={1807.03748},
      archivePrefix={arXiv},
      primaryClass={cs.LG},
      url={https://arxiv.org/abs/1807.03748},
}
```

<!--
## Glossary

*Clearly define terms in order to be accessible across audiences.*
-->

<!--
## Model Card Authors

*Lists the people who create the model card, providing recognition and accountability for the detailed work that goes into its construction.*
-->

<!--
## Model Card Contact

*Provides a way for people who have updates to the Model Card, suggestions, or questions, to contact the Model Card authors.*
-->