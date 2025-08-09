// GymIA Workout Performance Analyzer
// High-performance workout data analysis module written in Rust
// Demonstrates advanced Rust concepts: ownership, lifetimes, traits, and zero-cost abstractions

use std::collections::HashMap;
use std::fmt;

#[derive(Debug, Clone)]
pub struct Exercise {
    pub name: String,
    pub muscle_groups: Vec<String>,
    pub sets: u32,
    pub reps: u32,
    pub weight: f64,
    pub rest_time: u32, // seconds
}

#[derive(Debug, Clone)]
pub struct Workout {
    pub id: String,
    pub date: String,
    pub exercises: Vec<Exercise>,
    pub duration: u32, // minutes
    pub intensity: WorkoutIntensity,
}

#[derive(Debug, Clone, PartialEq)]
pub enum WorkoutIntensity {
    Low,
    Moderate,
    High,
    Extreme,
}

impl fmt::Display for WorkoutIntensity {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            WorkoutIntensity::Low => write!(f, "Low"),
            WorkoutIntensity::Moderate => write!(f, "Moderate"),
            WorkoutIntensity::High => write!(f, "High"),
            WorkoutIntensity::Extreme => write!(f, "Extreme"),
        }
    }
}

pub trait WorkoutAnalyzer {
    fn calculate_volume(&self) -> f64;
    fn calculate_intensity_score(&self) -> f64;
    fn get_muscle_group_distribution(&self) -> HashMap<String, u32>;
}

impl WorkoutAnalyzer for Workout {
    fn calculate_volume(&self) -> f64 {
        self.exercises.iter()
            .map(|exercise| exercise.sets as f64 * exercise.reps as f64 * exercise.weight)
            .sum()
    }

    fn calculate_intensity_score(&self) -> f64 {
        let base_score = self.exercises.len() as f64 * 10.0;
        let duration_factor = if self.duration > 0 { 60.0 / self.duration as f64 } else { 1.0 };
        let intensity_multiplier = match self.intensity {
            WorkoutIntensity::Low => 0.5,
            WorkoutIntensity::Moderate => 1.0,
            WorkoutIntensity::High => 1.5,
            WorkoutIntensity::Extreme => 2.0,
        };
        
        base_score * duration_factor * intensity_multiplier
    }

    fn get_muscle_group_distribution(&self) -> HashMap<String, u32> {
        let mut distribution = HashMap::new();
        
        for exercise in &self.exercises {
            for muscle_group in &exercise.muscle_groups {
                *distribution.entry(muscle_group.clone()).or_insert(0) += exercise.sets;
            }
        }
        
        distribution
    }
}

pub struct WorkoutPlan<'a> {
    pub name: &'a str,
    pub workouts: Vec<Workout>,
    pub goal: TrainingGoal,
}

#[derive(Debug, Clone)]
pub enum TrainingGoal {
    Strength,
    Hypertrophy,
    Endurance,
    PowerLifting,
    BodyBuilding,
}

impl<'a> WorkoutPlan<'a> {
    pub fn new(name: &'a str, goal: TrainingGoal) -> Self {
        WorkoutPlan {
            name,
            workouts: Vec::new(),
            goal,
        }
    }

    pub fn add_workout(&mut self, workout: Workout) {
        self.workouts.push(workout);
    }

    pub fn calculate_weekly_volume(&self) -> f64 {
        self.workouts.iter()
            .map(|workout| workout.calculate_volume())
            .sum()
    }

    pub fn get_average_intensity(&self) -> f64 {
        if self.workouts.is_empty() {
            return 0.0;
        }

        let total_intensity: f64 = self.workouts.iter()
            .map(|workout| workout.calculate_intensity_score())
            .sum();
        
        total_intensity / self.workouts.len() as f64
    }

    pub fn analyze_muscle_balance(&self) -> Result<HashMap<String, f64>, &'static str> {
        if self.workouts.is_empty() {
            return Err("No workouts to analyze");
        }

        let mut total_distribution = HashMap::new();
        let mut total_sets = 0u32;

        for workout in &self.workouts {
            let distribution = workout.get_muscle_group_distribution();
            for (muscle_group, sets) in distribution {
                *total_distribution.entry(muscle_group).or_insert(0) += sets;
                total_sets += sets;
            }
        }

        let percentage_distribution = total_distribution.into_iter()
            .map(|(muscle_group, sets)| {
                let percentage = (sets as f64 / total_sets as f64) * 100.0;
                (muscle_group, percentage)
            })
            .collect();

        Ok(percentage_distribution)
    }

    pub fn recommend_adjustments(&self) -> Vec<String> {
        let mut recommendations = Vec::new();
        
        if let Ok(muscle_balance) = self.analyze_muscle_balance() {
            // Check for muscle imbalances
            let max_percentage = muscle_balance.values().cloned().fold(0.0, f64::max);
            let min_percentage = muscle_balance.values().cloned().fold(100.0, f64::min);
            
            if max_percentage - min_percentage > 30.0 {
                recommendations.push("Consider balancing muscle group distribution".to_string());
            }
        }

        let avg_intensity = self.get_average_intensity();
        match self.goal {
            TrainingGoal::Strength if avg_intensity < 50.0 => {
                recommendations.push("Increase intensity for strength gains".to_string());
            },
            TrainingGoal::Hypertrophy if avg_intensity > 80.0 => {
                recommendations.push("Consider reducing intensity for better recovery".to_string());
            },
            TrainingGoal::Endurance if self.workouts.iter().any(|w| w.duration < 30) => {
                recommendations.push("Increase workout duration for endurance goals".to_string());
            },
            _ => {}
        }

        if recommendations.is_empty() {
            recommendations.push("Workout plan looks well-balanced!".to_string());
        }

        recommendations
    }
}

// Advanced Rust feature: Generic implementation with trait bounds
pub fn compare_workouts<T>(workout1: &T, workout2: &T) -> std::cmp::Ordering
where
    T: WorkoutAnalyzer,
{
    let volume1 = workout1.calculate_volume();
    let volume2 = workout2.calculate_volume();
    
    volume1.partial_cmp(&volume2).unwrap_or(std::cmp::Ordering::Equal)
}

// Memory-safe workout data processing with zero-cost abstractions
pub fn process_workout_batch(workouts: &[Workout]) -> (f64, f64, usize) {
    let total_volume = workouts.iter()
        .map(|w| w.calculate_volume())
        .sum();
    
    let avg_intensity = workouts.iter()
        .map(|w| w.calculate_intensity_score())
        .sum::<f64>() / workouts.len() as f64;
    
    let unique_exercises = workouts.iter()
        .flat_map(|w| w.exercises.iter())
        .map(|e| &e.name)
        .collect::<std::collections::HashSet<_>>()
        .len();
    
    (total_volume, avg_intensity, unique_exercises)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_workout_volume_calculation() {
        let exercise = Exercise {
            name: "Bench Press".to_string(),
            muscle_groups: vec!["Chest".to_string(), "Triceps".to_string()],
            sets: 3,
            reps: 10,
            weight: 80.0,
            rest_time: 120,
        };

        let workout = Workout {
            id: "test_workout".to_string(),
            date: "2024-01-01".to_string(),
            exercises: vec![exercise],
            duration: 45,
            intensity: WorkoutIntensity::Moderate,
        };

        assert_eq!(workout.calculate_volume(), 2400.0);
    }

    #[test]
    fn test_muscle_group_distribution() {
        let exercise1 = Exercise {
            name: "Bench Press".to_string(),
            muscle_groups: vec!["Chest".to_string()],
            sets: 3,
            reps: 10,
            weight: 80.0,
            rest_time: 120,
        };

        let exercise2 = Exercise {
            name: "Squats".to_string(),
            muscle_groups: vec!["Legs".to_string()],
            sets: 4,
            reps: 8,
            weight: 100.0,
            rest_time: 180,
        };

        let workout = Workout {
            id: "test_workout".to_string(),
            date: "2024-01-01".to_string(),
            exercises: vec![exercise1, exercise2],
            duration: 60,
            intensity: WorkoutIntensity::High,
        };

        let distribution = workout.get_muscle_group_distribution();
        assert_eq!(distribution.get("Chest"), Some(&3));
        assert_eq!(distribution.get("Legs"), Some(&4));
    }
}

// Example usage and demonstration
pub fn demo_workout_analysis() {
    let mut plan = WorkoutPlan::new("Strength Training", TrainingGoal::Strength);
    
    let bench_press = Exercise {
        name: "Bench Press".to_string(),
        muscle_groups: vec!["Chest".to_string(), "Triceps".to_string()],
        sets: 4,
        reps: 6,
        weight: 100.0,
        rest_time: 180,
    };

    let squats = Exercise {
        name: "Squats".to_string(),
        muscle_groups: vec!["Legs".to_string(), "Glutes".to_string()],
        sets: 4,
        reps: 8,
        weight: 120.0,
        rest_time: 180,
    };

    let workout = Workout {
        id: "day1".to_string(),
        date: "2024-01-01".to_string(),
        exercises: vec![bench_press, squats],
        duration: 75,
        intensity: WorkoutIntensity::High,
    };

    plan.add_workout(workout);
    
    println!("Weekly Volume: {:.2}", plan.calculate_weekly_volume());
    println!("Average Intensity: {:.2}", plan.get_average_intensity());
    
    let recommendations = plan.recommend_adjustments();
    for rec in recommendations {
        println!("Recommendation: {}", rec);
    }
}
