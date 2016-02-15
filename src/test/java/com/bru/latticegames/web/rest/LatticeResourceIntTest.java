package com.bru.latticegames.web.rest;

import com.bru.latticegames.Application;
import com.bru.latticegames.domain.Lattice;
import com.bru.latticegames.repository.LatticeRepository;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.hamcrest.Matchers.hasItem;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


/**
 * Test class for the LatticeResource REST controller.
 *
 * @see LatticeResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
@IntegrationTest
public class LatticeResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAA";
    private static final String UPDATED_NAME = "BBBBB";

    @Inject
    private LatticeRepository latticeRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restLatticeMockMvc;

    private Lattice lattice;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        LatticeResource latticeResource = new LatticeResource();
        ReflectionTestUtils.setField(latticeResource, "latticeRepository", latticeRepository);
        this.restLatticeMockMvc = MockMvcBuilders.standaloneSetup(latticeResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        lattice = new Lattice();
        lattice.setName(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void createLattice() throws Exception {
        int databaseSizeBeforeCreate = latticeRepository.findAll().size();

        // Create the Lattice

        restLatticeMockMvc.perform(post("/api/lattices")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(lattice)))
                .andExpect(status().isCreated());

        // Validate the Lattice in the database
        List<Lattice> lattices = latticeRepository.findAll();
        assertThat(lattices).hasSize(databaseSizeBeforeCreate + 1);
        Lattice testLattice = lattices.get(lattices.size() - 1);
        assertThat(testLattice.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = latticeRepository.findAll().size();
        // set the field null
        lattice.setName(null);

        // Create the Lattice, which fails.

        restLatticeMockMvc.perform(post("/api/lattices")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(lattice)))
                .andExpect(status().isBadRequest());

        List<Lattice> lattices = latticeRepository.findAll();
        assertThat(lattices).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllLattices() throws Exception {
        // Initialize the database
        latticeRepository.saveAndFlush(lattice);

        // Get all the lattices
        restLatticeMockMvc.perform(get("/api/lattices?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(lattice.getId().intValue())))
                .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }

    @Test
    @Transactional
    public void getLattice() throws Exception {
        // Initialize the database
        latticeRepository.saveAndFlush(lattice);

        // Get the lattice
        restLatticeMockMvc.perform(get("/api/lattices/{id}", lattice.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(lattice.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingLattice() throws Exception {
        // Get the lattice
        restLatticeMockMvc.perform(get("/api/lattices/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateLattice() throws Exception {
        // Initialize the database
        latticeRepository.saveAndFlush(lattice);

		int databaseSizeBeforeUpdate = latticeRepository.findAll().size();

        // Update the lattice
        lattice.setName(UPDATED_NAME);

        restLatticeMockMvc.perform(put("/api/lattices")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(lattice)))
                .andExpect(status().isOk());

        // Validate the Lattice in the database
        List<Lattice> lattices = latticeRepository.findAll();
        assertThat(lattices).hasSize(databaseSizeBeforeUpdate);
        Lattice testLattice = lattices.get(lattices.size() - 1);
        assertThat(testLattice.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    public void deleteLattice() throws Exception {
        // Initialize the database
        latticeRepository.saveAndFlush(lattice);

		int databaseSizeBeforeDelete = latticeRepository.findAll().size();

        // Get the lattice
        restLatticeMockMvc.perform(delete("/api/lattices/{id}", lattice.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Lattice> lattices = latticeRepository.findAll();
        assertThat(lattices).hasSize(databaseSizeBeforeDelete - 1);
    }
}
